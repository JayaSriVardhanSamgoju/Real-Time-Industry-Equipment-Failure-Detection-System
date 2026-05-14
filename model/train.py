import pandas as pd
import numpy as np
import os
import pickle
import math
from sklearn.ensemble import IsolationForest
from preprocessing.window_features import extract_features, get_feature_columns
from monitoring.mlflow_tracking import setup_mlflow, log_training_run
from utils.helpers import load_config, ensure_directory
from utils.logger import get_logger

logger = get_logger("ModelTraining")
config = load_config()


def generate_synthetic_training_data(n_samples: int = 5000) -> pd.DataFrame:
    """
    Generates realistic synthetic sensor data with:
      - Normal operational patterns
      - 2% injected anomalies for boundary learning
      - Gradual drift simulation
      - Sensor noise
    """
    np.random.seed(42)
    data = []

    for i in range(n_samples):
        drift = i * 0.001
        noise = config["simulation"]["noise_factor"]

        temp = np.random.normal(70, 2) + (drift * 5)
        vibration = np.random.normal(0.5, 0.05)
        humidity = 40.0 + 10.0 * math.sin(i / 100.0)

        # Add sensor noise
        temp += np.random.normal(0, noise * 5)
        vibration += np.random.normal(0, noise * 0.5)
        humidity += np.random.normal(0, noise * 2)

        # 2% anomalies — correlated spikes
        if np.random.random() < 0.02:
            spike = np.random.uniform(20, 40)
            temp += spike
            vibration += spike * 0.07  # correlated

        data.append([temp, vibration, humidity])

    return pd.DataFrame(data, columns=["temperature", "vibration", "humidity"])


def train_model():
    logger.info("Generating synthetic training data...")
    df = generate_synthetic_training_data()

    logger.info("Extracting sliding window features...")
    df_features = extract_features(df, config["model"]["window_size"])
    df_features = df_features.dropna()

    feature_cols = get_feature_columns()
    X_train = df_features[feature_cols]

    logger.info("Training Isolation Forest (contamination=%.2f, n_estimators=100)...",
                config["model"]["contamination_rate"])

    clf = IsolationForest(
        contamination=config["model"]["contamination_rate"],
        random_state=42,
        n_estimators=100
    )
    clf.fit(X_train)

    # Compute baseline stats for adaptive thresholding
    scores = clf.score_samples(X_train)
    baseline_stats = {
        "mean_score": float(np.mean(scores)),
        "std_score": float(np.std(scores)),
        "threshold": float(np.percentile(scores, 5))  # 5th percentile
    }
    logger.info("Baseline anomaly scores — mean=%.4f std=%.4f threshold=%.4f",
                baseline_stats["mean_score"], baseline_stats["std_score"], baseline_stats["threshold"])

    # MLflow logging
    setup_mlflow()
    log_training_run(
        params={
            "n_estimators": 100,
            "contamination": config["model"]["contamination_rate"],
            "window_size": config["model"]["window_size"],
            "training_samples": len(X_train)
        },
        metrics={
            "baseline_mean_score": baseline_stats["mean_score"],
            "baseline_std_score": baseline_stats["std_score"],
            "baseline_threshold": baseline_stats["threshold"]
        },
        model=clf,
        model_name="isolation_forest_model"
    )

    # Save model artifact
    ensure_directory(config["model"]["model_path"])
    with open(config["model"]["model_path"], "wb") as f:
        pickle.dump({
            "model": clf,
            "features": feature_cols,
            "baseline_stats": baseline_stats,
            "reference_data": X_train.sample(min(config["monitoring"]["reference_sample_size"], len(X_train)), random_state=42)
        }, f)

    logger.info("Model saved to %s", config["model"]["model_path"])


if __name__ == "__main__":
    train_model()