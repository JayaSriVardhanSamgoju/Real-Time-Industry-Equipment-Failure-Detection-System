import json
import os
import datetime
from utils.logger import get_logger
from utils.helpers import load_config, ensure_directory

logger = get_logger("AlertManager")
config = load_config()
LOG_FILE = config["alerting"]["log_file"]
thresholds = config["alerting"]["levels"]


def classify_alert(anomaly_score: float) -> str:
    """
    Multi-level alerting based on anomaly score severity.
      🟢 LOW    → minor deviation
      🟡 MEDIUM → suspicious pattern
      🔴 HIGH   → critical failure risk
    """
    if anomaly_score <= thresholds["high_threshold"]:
        return "HIGH"
    elif anomaly_score <= thresholds["medium_threshold"]:
        return "MEDIUM"
    elif anomaly_score <= thresholds["low_threshold"]:
        return "LOW"
    return "NONE"


def send_alert(result: dict):
    """
    Hybrid alert logic: processes ML-based anomalies and adds rule-based validation.
    Persists all alerts to anomaly_logs.json.
    """
    if not result.get("is_anomaly"):
        return

    score = result.get("anomaly_score", 0)
    level = classify_alert(score)

    # Rule-based validation: confirm with threshold check on raw values
    temp = result.get("temperature", 0)
    vib = result.get("vibration", 0)
    rule_triggered = temp > 90 or vib > 1.5

    if level == "NONE" and not rule_triggered:
        return

    # Upgrade level if rule-based also triggers
    if rule_triggered and level == "LOW":
        level = "MEDIUM"

    alert_record = {
        "timestamp": result.get("timestamp", datetime.datetime.now().isoformat()),
        "equipment_id": result.get("equipment_id"),
        "alert_level": level,
        "anomaly_score": score,
        "temperature": temp,
        "vibration": vib,
        "humidity": result.get("humidity", 0),
        "ml_flagged": True,
        "rule_flagged": rule_triggered
    }

    icons = {"LOW": "🟢", "MEDIUM": "🟡", "HIGH": "🔴"}
    icon = icons.get(level, "⚪")
    logger.warning("%s [%s] Equipment %s | score=%.4f | T=%.1f V=%.3f",
                   icon, level, result.get("equipment_id"), score, temp, vib)

    # Persist to JSON
    ensure_directory(LOG_FILE)
    with open(LOG_FILE, "a") as f:
        json.dump(alert_record, f)
        f.write("\n")