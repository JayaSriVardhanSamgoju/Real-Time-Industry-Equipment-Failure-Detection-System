from evidently.report import Report
from evidently.metric_preset import DataDriftPreset
import pandas as pd
from utils.logger import get_logger
import warnings

warnings.filterwarnings("ignore")
logger = get_logger("DriftDetection")


def detect_drift(reference_df: pd.DataFrame, current_df: pd.DataFrame) -> dict:
    """
    Uses EvidentlyAI DataDriftPreset to compare live streaming data
    against the training reference distribution.

    Returns:
        dict with keys: drift_detected (bool), drift_share (float), details (dict)
    """
    try:
        report = Report(metrics=[DataDriftPreset()])
        report.run(reference_data=reference_df, current_data=current_df)

        result = report.as_dict()
        drift_result = result["metrics"][0]["result"]
        drift_detected = drift_result["dataset_drift"]
        drift_share = drift_result.get("share_of_drifted_columns", 0)

        if drift_detected:
            logger.warning(
                "⚠️  DATA DRIFT DETECTED | %.0f%% of features drifted — consider retraining",
                drift_share * 100
            )
        else:
            logger.info("✅ No drift detected — distributions stable (drift share: %.1f%%)", drift_share * 100)

        return {
            "drift_detected": drift_detected,
            "drift_share": drift_share,
            "details": drift_result
        }

    except Exception as e:
        logger.error("Drift detection failed: %s", e)
        return {"drift_detected": False, "drift_share": 0, "details": {}}