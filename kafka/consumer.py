from kafka import KafkaConsumer
import json
from utils.helpers import load_config
from utils.logger import get_logger

logger = get_logger("KafkaConsumer")
config = load_config()

def get_consumer(topic=None):
    topic = topic or config["kafka"]["sensor_topic"]
    logger.info("Subscribing consumer to topic: %s", topic)
    return KafkaConsumer(
        topic,
        bootstrap_servers=config["kafka"]["bootstrap_servers"],
        auto_offset_reset="latest",
        value_deserializer=lambda m: json.loads(m.decode("utf-8"))
    )