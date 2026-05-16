import pickle
import time
import datetime
import pandas as pd
import numpy as np
import warnings
import requests
from preprocessing.window_features import extract_features, get_feature_columns
from kafka_integration.consumer import get_consumer
from alerting.alert_manager import send_alert, classify_alert
from monitoring.drift_detection import detect_drift
from utils.helpers import load_config
from utils.logger import get_logger

warnings.filterwarnings("ignore")
logger = get_logger("InferenceEngine")
config = load_config()

API_URL = f"http://localhost:{config['api']['port']}/predict"
DRIFT_URL = f"http://localhost:{config['api']['port']}/drift_report"


def load_model():
    try:
        with open(config["model"]["model_path"], "rb") as f:
            data = pickle.load(f)
        logger.info("Model loaded from %s", config["model"]["model_path"])
        return data["model"], data["features"], data.get("reference_data"), data.get("baseline_stats")
    except FileNotFoundError:
        logger.error("model.pkl not found — run `python -m model.train` first")
        return None, None, None, None


# ──────────────────────────────────────────────
#  Rule-Based Fallback Engine
# ──────────────────────────────────────────────
def rule_based_fallback(data: dict) -> bool:
    """Fallback anomaly detection when ML model confidence is low."""
    return data.get("temperature", 0) > 95 or data.get("vibration", 0) > 2.0


# ──────────────────────────────────────────────
#  Adaptive Threshold Calculator
# ──────────────────────────────────────────────
class AdaptiveThreshold:
    """Dynamically adjusts anomaly threshold using rolling statistics."""

    def __init__(self, baseline_stats: dict):
        self.scores = []
        self.base_threshold = baseline_stats.get("threshold", -0.3)

    def update(self, score: float) -> float:
        self.scores.append(score)
        if len(self.scores) > 200:
            self.scores.pop(0)
        if len(self.scores) >= 20:
            return float(np.mean(self.scores) - 2.0 * np.std(self.scores))
        return self.base_threshold

    @property
    def current(self):
        if len(self.scores) >= 20:
            return float(np.mean(self.scores) - 2.0 * np.std(self.scores))
        return self.base_threshold


# ──────────────────────────────────────────────
#  Main Streaming Inference Loop
# ──────────────────────────────────────────────
def run_prediction_loop():
    model, feature_cols, reference_df, baseline_stats = load_model()
    if model is None:
        return

    consumer = get_consumer()
    adaptive = AdaptiveThreshold(baseline_stats or {})
    window_size = config["model"]["window_size"]
    drift_interval = config["monitoring"]["drift_check_interval"]

    buffer = []
    drift_buffer = []
    record_count = 0

    logger.info("Real-time inference engine started — listening for sensor data...")

    try:
        for msg in consumer:
            data = msg.value
            buffer.append(data)

            if len(buffer) > window_size:
                buffer.pop(0)

            if len(buffer) < window_size:
                continue

            df = pd.DataFrame(buffer)
            df_features = extract_features(df, window_size).dropna()

            if df_features.empty:
                continue

            latest = df_features.iloc[-1:][feature_cols]

            # ML Prediction
            prediction = model.predict(latest)[0]
            anomaly_score = float(model.score_samples(latest)[0])

            # Adaptive threshold
            dynamic_threshold = adaptive.update(anomaly_score)
            is_anomaly_ml = prediction == -1 or anomaly_score < dynamic_threshold

            # Fallback logic: if model confidence is borderline, check rules
            is_anomaly_rule = rule_based_fallback(data)
            is_anomaly = is_anomaly_ml or is_anomaly_rule

            alert_level = classify_alert(anomaly_score) if is_anomaly else "NONE"

            result = {
                "equipment_id": data["equipment_id"],
                "is_anomaly": bool(is_anomaly),
                "anomaly_score": anomaly_score,
                "alert_level": alert_level,
                "dynamic_threshold": dynamic_threshold,
                "timestamp": data["timestamp"],
                "temperature": data["temperature"],
                "vibration": data["vibration"],
                "humidity": data["humidity"]
            }

            if is_anomaly:
                send_alert(result)

            # Collect for drift analysis
            drift_buffer.append(latest.iloc[0].to_dict())
            record_count += 1

            if len(drift_buffer) >= drift_interval and reference_df is not None:
                drift_result = detect_drift(reference_df, pd.DataFrame(drift_buffer))
                drift_buffer = []

                # Report drift to API
                try:
                    drift_payload = {
                        "drift_detected": drift_result.get("drift_detected", False),
                        "drift_share": drift_result.get("drift_share", 0.0),
                        "checked_at": datetime.datetime.now().isoformat(),
                        "details": {}
                    }
                    requests.post(DRIFT_URL, json=drift_payload, timeout=1)
                except requests.exceptions.RequestException:
                    pass

            # Push to API
            try:
                requests.post(API_URL, json=result, timeout=1)
            except requests.exceptions.RequestException:
                pass

    except KeyboardInterrupt:
        logger.info("Inference stopped by user.")
    finally:
        consumer.close()


if __name__ == "__main__":
    run_prediction_loop()