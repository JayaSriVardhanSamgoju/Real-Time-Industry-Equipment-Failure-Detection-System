import pandas as pd
import numpy as np

SENSOR_COLS = ["temperature", "vibration", "humidity"]

def extract_features(df: pd.DataFrame, window_size: int = 10) -> pd.DataFrame:
    """
    Transforms raw sensor readings into a 15-dimensional feature vector
    using a sliding window approach.

    For each sensor (temperature, vibration, humidity):
        - Rolling Mean   (_mean)
        - Rolling Std    (_std)
        - Rolling Min    (_min)
        - Rolling Max    (_max)
        - Rate of Change (_roc)
    """
    df = df.copy()

    for col in SENSOR_COLS:
        rolling = df[col].rolling(window=window_size, min_periods=1)
        df[f"{col}_mean"] = rolling.mean()
        df[f"{col}_std"]  = rolling.std().fillna(0)
        df[f"{col}_min"]  = rolling.min()
        df[f"{col}_max"]  = rolling.max()
        df[f"{col}_roc"]  = df[col].diff(periods=min(window_size - 1, len(df) - 1)).fillna(0)

    return df


def get_feature_columns() -> list:
    """Returns the list of 15 engineered feature column names."""
    cols = []
    for col in SENSOR_COLS:
        cols.extend([
            f"{col}_mean", f"{col}_std", f"{col}_min",
            f"{col}_max", f"{col}_roc"
        ])
    return cols
