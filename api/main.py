from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import time
import datetime

app = FastAPI(
    title="Real-Time Equipment Failure Detection API",
    description="Production API for streaming anomaly detection on industrial equipment",
    version="1.0.0"
)

# ──────────────────────────────────────────────
#  CORS Middleware
# ──────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ──────────────────────────────────────────────
#  Data Models
# ──────────────────────────────────────────────
class PredictionResult(BaseModel):
    equipment_id: str
    is_anomaly: bool
    anomaly_score: float
    alert_level: Optional[str] = "NONE"
    dynamic_threshold: Optional[float] = 0.0
    timestamp: str
    temperature: float
    vibration: float
    humidity: float

class DriftReport(BaseModel):
    drift_detected: bool
    drift_share: float
    checked_at: str
    details: Optional[dict] = {}

# ──────────────────────────────────────────────
#  In-Memory Store
# ──────────────────────────────────────────────
recent_predictions: List[PredictionResult] = []
_start_time = time.time()
_total_received = 0
_total_anomalies = 0
_latest_drift: Optional[DriftReport] = None


# ──────────────────────────────────────────────
#  Endpoints
# ──────────────────────────────────────────────
@app.get("/")
def root():
    return {
        "service": "Real-Time Equipment Failure Detection API",
        "version": "1.0.0",
        "status": "running",
        "docs": "/docs"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "Equipment Failure Detection API",
        "uptime_seconds": round(time.time() - _start_time, 1)
    }


@app.post("/predict")
def log_prediction(result: PredictionResult):
    global _total_received, _total_anomalies
    recent_predictions.append(result)
    _total_received += 1
    if result.is_anomaly:
        _total_anomalies += 1
    if len(recent_predictions) > 500:
        recent_predictions.pop(0)
    return {"status": "logged"}


@app.get("/live_data/", response_model=List[PredictionResult])
def get_live_data():
    return recent_predictions[-100:]


@app.get("/recent_anomalies/", response_model=List[PredictionResult])
def get_recent_anomalies():
    return [p for p in recent_predictions if p.is_anomaly][-50:]


@app.get("/system_metrics")
def system_metrics():
    uptime = time.time() - _start_time
    throughput = _total_received / max(uptime, 1)
    anomaly_rate = (_total_anomalies / max(_total_received, 1)) * 100
    return {
        "uptime_seconds": round(uptime, 1),
        "total_records_processed": _total_received,
        "total_anomalies_detected": _total_anomalies,
        "throughput_records_per_sec": round(throughput, 2),
        "anomaly_rate_percent": round(anomaly_rate, 2)
    }


@app.post("/drift_report")
def update_drift_report(report: DriftReport):
    global _latest_drift
    _latest_drift = report
    return {"status": "updated"}


@app.get("/drift_report")
def get_drift_report():
    if _latest_drift:
        return _latest_drift
    return {"drift_detected": False, "drift_share": 0.0, "checked_at": "N/A", "details": {}}


@app.get("/alert_summary")
def alert_summary():
    """Aggregated alert counts by severity level."""
    counts = {"HIGH": 0, "MEDIUM": 0, "LOW": 0, "NONE": 0}
    for p in recent_predictions:
        level = p.alert_level or "NONE"
        if level in counts:
            counts[level] += 1
    return counts