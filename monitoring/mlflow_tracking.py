import mlflow
from utils.logger import get_logger

logger = get_logger("MLflowTracking")

def setup_mlflow(tracking_uri="sqlite:///mlflow.db"):
    mlflow.set_tracking_uri(tracking_uri)
    logger.info("MLflow tracking URI set to: %s", tracking_uri)

def log_training_run(params: dict, metrics: dict, model, model_name: str):
    with mlflow.start_run():
        for k, v in params.items():
            mlflow.log_param(k, v)
        for k, v in metrics.items():
            mlflow.log_metric(k, v)
        mlflow.sklearn.log_model(model, model_name)
        logger.info("MLflow run logged — params=%s metrics=%s", params, metrics)