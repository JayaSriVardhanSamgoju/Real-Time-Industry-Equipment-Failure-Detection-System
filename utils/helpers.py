import yaml
import os

_config = None

def load_config(path="config/config.yaml"):
    global _config
    if _config is None:
        with open(path, "r") as f:
            _config = yaml.safe_load(f)
    return _config

def ensure_directory(path):
    os.makedirs(os.path.dirname(path), exist_ok=True)