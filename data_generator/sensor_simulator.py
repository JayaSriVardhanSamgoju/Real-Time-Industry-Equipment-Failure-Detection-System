import time
import json
import random
import datetime
import math
from utils.logger import get_logger
from utils.helpers import load_config

logger = get_logger("SensorSimulator")
config = load_config()
sim_config = config["simulation"]

# ──────────────────────────────────────────────
#  Equipment Degradation State Machine
# ──────────────────────────────────────────────
class EquipmentState:
    """Tracks multi-stage degradation: NORMAL → DEGRADING → UNSTABLE → FAILURE"""

    NORMAL = "NORMAL"
    DEGRADING = "DEGRADING"
    UNSTABLE = "UNSTABLE"
    FAILURE = "FAILURE"

    def __init__(self):
        self.stage = self.NORMAL
        self.wear = 0.0          # cumulative drift factor
        self.ticks_in_stage = 0
        self.cycle_length = random.randint(300, 600)  # ticks before stage change

    def step(self):
        self.ticks_in_stage += 1
        self.wear += 0.001  # gradual long-term drift

        if self.stage == self.NORMAL and self.ticks_in_stage > self.cycle_length:
            self.stage = self.DEGRADING
            self.ticks_in_stage = 0
            self.cycle_length = random.randint(100, 200)
            logger.info("Equipment entering DEGRADING stage")

        elif self.stage == self.DEGRADING and self.ticks_in_stage > self.cycle_length:
            self.stage = self.UNSTABLE
            self.ticks_in_stage = 0
            self.cycle_length = random.randint(30, 80)
            logger.warning("Equipment entering UNSTABLE stage")

        elif self.stage == self.UNSTABLE and self.ticks_in_stage > self.cycle_length:
            self.stage = self.FAILURE
            self.ticks_in_stage = 0
            logger.critical("Equipment entering FAILURE stage — spike imminent")

        elif self.stage == self.FAILURE and self.ticks_in_stage > 10:
            # After failure burst, reset to normal (maintenance happened)
            self.stage = self.NORMAL
            self.ticks_in_stage = 0
            self.cycle_length = random.randint(300, 600)
            logger.info("Equipment RESET to NORMAL after maintenance")


# ──────────────────────────────────────────────
#  Core Sensor Generation
# ──────────────────────────────────────────────
def generate_sensor_data(tick: int, state: EquipmentState):
    noise = sim_config["noise_factor"]

    # Base signals
    temperature = random.gauss(70.0, 2.0) + (state.wear * 10)
    vibration = random.gauss(0.5, 0.05)
    humidity = 40.0 + 10.0 * math.sin(tick / 100.0)

    # Add sensor noise
    temperature += random.gauss(0, noise * 5)
    vibration += random.gauss(0, noise * 0.5)
    humidity += random.gauss(0, noise * 2)

    # Stage-based behaviour
    if state.stage == EquipmentState.DEGRADING:
        temperature += random.uniform(3, 8)
        vibration += random.uniform(0.1, 0.3)

    elif state.stage == EquipmentState.UNSTABLE:
        temperature += random.uniform(8, 18)
        vibration += random.uniform(0.3, 1.0)

    elif state.stage == EquipmentState.FAILURE:
        # Correlated spike: temp AND vibration go up together
        spike = random.uniform(20, 40)
        temperature += spike
        vibration += spike * 0.07  # correlated

    # Random independent anomaly (5%)
    if random.random() < sim_config["anomaly_probability"]:
        temperature += random.uniform(15, 30)
        vibration += random.uniform(1.0, 2.5)

    return {
        "equipment_id": "EQP-001",
        "temperature": round(float(temperature), 2),
        "vibration": round(float(vibration), 3),
        "humidity": round(float(humidity), 2),
        "stage": state.stage,
        "timestamp": datetime.datetime.now().isoformat()
    }


# ──────────────────────────────────────────────
#  Main Simulation Loop (Kafka Producer)
# ──────────────────────────────────────────────
def start_simulation():
    from kafka import KafkaProducer

    producer = KafkaProducer(
        bootstrap_servers=config["kafka"]["bootstrap_servers"],
        value_serializer=lambda v: json.dumps(v).encode("utf-8")
    )
    topic = config["kafka"]["sensor_topic"]
    state = EquipmentState()

    logger.info("Sensor simulation started — streaming to Kafka topic '%s'", topic)

    tick = 0
    try:
        while True:
            state.step()
            data = generate_sensor_data(tick, state)
            producer.send(topic, data)
            logger.info("Tick %d [%s] | T=%.1f V=%.3f H=%.1f",
                        tick, state.stage,
                        data["temperature"], data["vibration"], data["humidity"])
            tick += 1
            time.sleep(sim_config["send_interval_sec"])
    except KeyboardInterrupt:
        logger.info("Simulation stopped by user.")
    finally:
        producer.close()


if __name__ == "__main__":
    start_simulation()