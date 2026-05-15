from kafka import KafkaProducer
import json
from utils.helpers import load_config
from utils.logger import get_logger

logger = get_logger("KafkaProducer")
config = load_config()

def get_producer():
    logger.info("Connecting Kafka producer to %s", config["kafka"]["bootstrap_servers"])
    return KafkaProducer(
        bootstrap_servers=config["kafka"]["bootstrap_servers"],
        value_serializer=lambda v: json.dumps(v).encode("utf-8")
    )