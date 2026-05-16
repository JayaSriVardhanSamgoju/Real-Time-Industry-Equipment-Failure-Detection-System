        # 🏭 Real-Time Industrial Equipment Failure Detection System

        ### Production-Grade Streaming Machine Learning Pipeline

        ---

        ## 💼 Business Problem & Impact

        Industrial equipment failures lead to **massive financial losses**, production downtime, and safety risks. Traditional maintenance systems are reactive — they detect issues only after failure occurs.

        This project solves that by enabling:
        - 🔍 **Early anomaly detection** in machine behavior
        - ⚡ **Real-time monitoring of equipment health**
        - 🛠️ **Predictive maintenance instead of reactive repair**
        - 💰 **Reduced operational downtime and cost savings**

        ---

        ## 🎯 System Objective

        Design and implement a **real-time intelligent monitoring system** that:
        - Continuously ingests sensor data streams via Apache Kafka
        - Detects abnormal machine behavior instantly using Isolation Forest
        - Adapts to changing data patterns over time (adaptive thresholds)
        - Provides actionable multi-level alerts and visual insights
        - Monitors for data drift using EvidentlyAI
        - Tracks ML experiments with MLflow

        ---

        ## 🏗️ System Architecture

        ### 🔁 End-to-End Pipeline

        ```
        [Sensor Simulation Engine]
                ↓
        [Kafka Producer]
                ↓
        [Kafka Topic: sensor_stream]
                ↓
        [Streaming Consumer Engine]
                ↓
        [Sliding Window Processor (size=10)]
                ↓
        [Feature Engineering Layer (15 features)]
                ↓
        [ML Inference Engine (Isolation Forest)]
                ↓
        [Adaptive Threshold + Rule-Based Fallback]
                ↓
        [Multi-Level Alert System (LOW / MEDIUM / HIGH)]
                ↓
        [FastAPI Backend (8 endpoints)]
                ↓
        [Streamlit Dashboard (Live Charts, Anomaly Feed, Drift Indicators)]
                ↓
        [Monitoring: MLflow (Experiment Tracking) + EvidentlyAI (Drift Detection)]
        ```

        ---

        ## 🧪 Advanced Sensor Simulation Engine

        Since real IoT hardware is unavailable, we built a **high-fidelity multi-stage simulation**.

        ### Simulated Sensors

        | Sensor | Base Distribution | Failure Mode | Additional |
        |---|---|---|---|
        | 🌡️ Temperature | Gaussian ~70°C ± 2 | Spikes +20–40°C | Gradual drift over time |
        | ⚙️ Vibration | Gaussian ~0.5G ± 0.05 | Jumps +1.5–3.0G | Correlated with temperature |
        | 💧 Humidity | Sinusoidal ~40% ± 10 | — | Day/night environmental cycles |

        ### 🔥 Advanced Realism Enhancements

        - **Correlated Failures**: Temperature ↑ and Vibration ↑ spike together (physically realistic)
        - **Multi-Stage Degradation State Machine**: `NORMAL → DEGRADING → UNSTABLE → FAILURE → RESET`
        - **Noise Injection**: Random Gaussian noise simulates real sensor inaccuracies
        - **Configurable Anomaly Rate**: Default 5% probability, tunable in `config.yaml`

        ### Dataset Approach

        > ⚠️ **We do NOT use a static CSV dataset.** Instead, we generate an infinite, realistic data stream programmatically. This more closely mirrors real-world IoT deployments where data arrives continuously.
        >
        > **For training**, `model/train.py` generates 5,000 synthetic samples with the exact same statistical profile as the live simulator, including 2% injected correlated anomalies.
        >
        > **For Colab training**, upload `train_colab.ipynb` to Google Colab and run it. It reproduces the same data generation + model training workflow and exports `model.pkl` for download.

        ---

        ## 🧠 Feature Engineering (Sliding Window Strategy)

        Raw streaming data is too noisy for direct ML inference. We apply a **sliding window** approach:

        - **Window Size**: 10 seconds (configurable in `config.yaml`)
        - **Rolling Buffer**: Maintains the last 10 readings in memory

        ### Extracted Features (per sensor)

        | Feature | Description |
        |---|---|
        | `_mean` | Rolling average over window |
        | `_std` | Rolling standard deviation (volatility) |
        | `_min` | Minimum value in window |
        | `_max` | Maximum value in window |
        | `_roc` | Rate of change (current − oldest in window) |

        **Result**: 3 sensors × 5 features = **15-dimensional feature vector per second**

        ---

        ## 🤖 Machine Learning Layer

        ### Primary Model: Isolation Forest

        | Property | Value |
        |---|---|
        | Algorithm | `sklearn.ensemble.IsolationForest` |
        | Type | Unsupervised anomaly detection |
        | n_estimators | 100 |
        | contamination | 0.05 (top 5% as anomalies) |
        | Output | `1` = Normal, `-1` = Anomaly |

        ### Why Isolation Forest?
        - Works **without labeled failure data** (unsupervised)
        - Efficient for **high-dimensional streaming data**
        - Robust to noise — isolates outliers via random partitioning

        ### Adaptive Thresholding
        Instead of a fixed cutoff, the system maintains a **rolling window of anomaly scores** and dynamically computes:
        ```
        Threshold = mean(recent_scores) − 2 × std(recent_scores)
        ```
        This makes the system self-adjusting to changing equipment behavior.

        ### Rule-Based Fallback
        When ML model confidence is borderline, a rule-based engine activates:
        - Temperature > 95°C → Anomaly
        - Vibration > 2.0G → Anomaly

        If both ML and rules agree, the alert severity is **automatically upgraded**.

        ---

        ## 🚨 Intelligent Alert System

        ### Multi-Level Alerting

        | Level | Anomaly Score | Meaning |
        |---|---|---|
        | 🟢 LOW | ≤ −0.2 | Minor deviation |
        | 🟡 MEDIUM | ≤ −0.4 | Suspicious pattern |
        | 🔴 HIGH | ≤ −0.6 | Critical failure risk |

        ### Hybrid Decision Logic
        - **ML-based**: Isolation Forest score + adaptive threshold
        - **Rule-based**: Physical sensor threshold validation
        - **Upgrade**: If both ML + rules trigger → severity increases

        ### Persistent Storage
        All alerts are logged to `storage/anomaly_logs.json` as newline-delimited JSON for audit trails.

        ---

        ## 📊 Observability & Monitoring

        ### 📉 Drift Detection (EvidentlyAI)
        - Compares live streaming distributions vs. training reference snapshot
        - Uses Kolmogorov-Smirnov statistical tests
        - Runs automatically every 100 records (configurable)
        - Reports drift status to API for dashboard visualization
        - Triggers retraining warnings when drift exceeds thresholds

        ### 🔁 Model Lifecycle (MLflow)
        - Tracks all training experiments in SQLite backend
        - Logs: contamination, window_size, n_estimators, baseline scores
        - Stores serialized model artifacts for versioning

        ### System Metrics (API)
        - `throughput_records_per_sec` — Processing speed
        - `anomaly_rate_percent` — Live anomaly percentage
        - `total_records_processed` — Cumulative counter
        - `uptime_seconds` — API uptime

        ---

        ## 🌐 API Layer (FastAPI)

        | Endpoint | Method | Description |
        |---|---|---|
        | `/` | GET | Service info + version |
        | `/health` | GET | System health + uptime |
        | `/predict` | POST | Ingest prediction results |
        | `/recent_anomalies/` | GET | Latest anomaly records |
        | `/live_data/` | GET | Last 100 records for dashboard |
        | `/system_metrics` | GET | Throughput, anomaly rate, uptime |
        | `/drift_report` | GET/POST | Latest data drift status |
        | `/alert_summary` | GET | Alert counts by severity level |

        Interactive API docs available at `http://localhost:8000/docs` (Swagger UI).

        ---

        ## 📊 Dashboard (React + TypeScript)

        Premium dark-themed real-time monitoring dashboard with:

        | Feature | Description |
        |---|---|
        | 📈 Live Sensor Trends | Real-time temperature, vibration, humidity area charts |
        | 🔥 Anomaly Score Timeline | Color-coded score plot with adaptive threshold overlay |
        | 📊 Alert Distribution | Interactive donut chart of alert severity breakdown |
        | ⚠️ Anomaly Alert Feed | Color-coded real-time alert cards (🟢🟡🔴) |
        | 🔗 Correlation Heatmap | Sensor-to-anomaly Pearson correlation matrix |
        | 📉 Drift Indicators | Baseline deviation metrics + drift status panels |
        | 📋 Raw Data Table | Optional: toggleable formatted raw stream view |
        | ⚙️ Sidebar Controls | Refresh rate, toggles, system info, architecture diagram |

        ---

        ## 📁 Project Structure

        ```
        Real Time Industry Equipment Failure Detection/
        │
        ├── config/
        │   └── config.yaml              # All configurable parameters
        │
        ├── data_generator/
        │   ├── __init__.py
        │   └── sensor_simulator.py      # Multi-stage degradation simulator + Kafka producer
        │
        ├── kafka_integration/
        │   ├── __init__.py
        │   ├── producer.py              # Kafka producer wrapper
        │   └── consumer.py              # Kafka consumer wrapper
        │
        ├── preprocessing/
        │   ├── __init__.py
        │   └── window_features.py       # 15-dim sliding window feature extraction
        │
        ├── model/
        │   ├── __init__.py
        │   ├── train.py                 # Isolation Forest training + MLflow logging
        │   ├── predict.py               # Real-time streaming inference engine
        │   └── model.pkl                # Serialized trained model (generated)
        │
        ├── monitoring/
        │   ├── __init__.py
        │   ├── mlflow_tracking.py       # MLflow experiment tracking
        │   └── drift_detection.py       # EvidentlyAI drift detection
        │
        ├── alerting/
        │   ├── __init__.py
        │   └── alert_manager.py         # Multi-level hybrid alert system
        │
        ├── api/
        │   ├── __init__.py
        │   └── main.py                  # FastAPI backend (8 endpoints + CORS)
        │
        ├── dashboard/
        │   └── app.py                   # Premium Streamlit + Plotly dashboard
        │
        ├── utils/
        │   ├── __init__.py
        │   ├── logger.py                # Structured production logging
        │   └── helpers.py               # Config loader + utilities
        │
        ├── storage/
        │   └── anomaly_logs.json        # Persistent anomaly audit trail (generated)
        │
        ├── docker/
        │   └── docker-compose.yml       # Kafka + Zookeeper + API + Dashboard
        │
        ├── Dockerfile                   # Python service container
        ├── .dockerignore                # Build context exclusions
        ├── train_colab.ipynb            # Google Colab training notebook
        ├── requirements.txt             # All Python dependencies
        └── README.md                    # This file
        ```

        ---

        ## 🚀 Setup & Execution

        ### Prerequisites
        - **Python 3.10+** with pip
        - **Docker Desktop** (for Kafka/Zookeeper)
        - 4 terminal windows for running all services

        ### Step 1 — Clone & Install Dependencies

        ```bash
        # Create and activate virtual environment
        python -m venv .venv

        # Windows
        .venv\Scripts\activate

        # macOS/Linux
        source .venv/bin/activate

        # Install all dependencies
        pip install -r requirements.txt
        ```

        ### Step 2 — Start Kafka Infrastructure (Docker)

        ```bash
        docker-compose -f docker/docker-compose.yml up -d zookeeper kafka
        ```

        Wait ~10 seconds for Kafka to initialize, then verify:
        ```bash
        docker ps
        # Both efd-zookeeper and efd-kafka should show "Up"
        ```

        ### Step 3 — Train the Model

        ```bash
        python -m model.train
        ```

        **Output**: Generates `model/model.pkl` containing the trained Isolation Forest, baseline statistics, feature list, and reference data for drift detection. Training metrics are logged to MLflow.

        ### Step 4 — Start FastAPI Backend (Terminal 1)

        ```bash
        uvicorn api.main:app --reload --host 0.0.0.0 --port 8000
        ```

        Verify at: [http://localhost:8000/health](http://localhost:8000/health)
        API Docs at: [http://localhost:8000/docs](http://localhost:8000/docs)

        ### Step 5 — Start React Frontend Dashboard (Terminal 2)

        ```bash
        cd frontend
        npm install
        npm run dev
        ```

        Dashboard available at: [http://localhost:5173](http://localhost:5173)

        ### Step 6 — Start Inference Engine (Terminal 3)

        ```bash
        python -m model.predict
        ```

        This connects to Kafka, consumes sensor data, runs ML inference, and pushes results to the API.

        ### Step 7 — Start Sensor Simulator (Terminal 4)

        ```bash
        python -m data_generator.sensor_simulator
        ```

        **Data now streams through the entire pipeline — watch the dashboard light up!**

        ### Quick Reference — All Commands

        | Terminal | Command | Purpose |
        |---|---|---|
        | Docker | `docker-compose -f docker/docker-compose.yml up -d zookeeper kafka` | Kafka infrastructure |
        | Terminal 1 | `uvicorn api.main:app --reload` | FastAPI backend |
        | Terminal 2 | `cd frontend && npm run dev` | Live React dashboard |
        | Terminal 3 | `python -m model.predict` | ML inference engine |
        | Terminal 4 | `python -m data_generator.sensor_simulator` | Sensor data stream |

        ### Stopping Everything

        ```bash
        # Stop Python services: Ctrl+C in each terminal

        # Stop Kafka/Zookeeper
        docker-compose -f docker/docker-compose.yml down
        ```

        ---

        ## 🐳 Full Docker Deployment (Optional)

        To run the entire stack in Docker:

        ```bash
        docker-compose -f docker/docker-compose.yml up --build
        ```

        This builds and starts Zookeeper, Kafka, API, and Dashboard containers.

        ---

        ## 🔧 Configuration

        All parameters are centralized in `config/config.yaml`:

        | Section | Parameter | Default | Description |
        |---|---|---|---|
        | `kafka` | `bootstrap_servers` | `localhost:9092` | Kafka broker address |
        | `kafka` | `sensor_topic` | `sensor_stream` | Kafka topic name |
        | `model` | `window_size` | `10` | Sliding window size (seconds) |
        | `model` | `contamination_rate` | `0.05` | Isolation Forest contamination |
        | `model` | `anomaly_threshold` | `-0.3` | Base anomaly score threshold |
        | `alerting` | `low_threshold` | `-0.2` | LOW alert threshold |
        | `alerting` | `medium_threshold` | `-0.4` | MEDIUM alert threshold |
        | `alerting` | `high_threshold` | `-0.6` | HIGH alert threshold |
        | `monitoring` | `drift_check_interval` | `100` | Records between drift checks |
        | `simulation` | `anomaly_probability` | `0.05` | Simulated anomaly rate |
        | `simulation` | `noise_factor` | `0.02` | Sensor noise multiplier |
        | `simulation` | `send_interval_sec` | `1` | Data generation frequency |
        | `dashboard` | `refresh_rate_sec` | `2` | Dashboard refresh interval |

        ---

        ## 🧩 Component Deep Dive

        ### Sensor Simulator (`data_generator/sensor_simulator.py`)
        - Implements a **4-stage degradation state machine**: NORMAL → DEGRADING → UNSTABLE → FAILURE
        - Each stage progressively increases temperature and vibration anomalies
        - After FAILURE stage (10 ticks), equipment resets to NORMAL (simulating maintenance)
        - Publishes JSON messages to Kafka with equipment_id, sensor readings, stage, and timestamp

        ### Inference Engine (`model/predict.py`)
        - Consumes Kafka messages in real-time
        - Maintains a sliding window buffer of the last 10 readings
        - Extracts 15 features using rolling statistics
        - Runs Isolation Forest prediction + adaptive threshold check
        - Applies rule-based fallback for borderline cases
        - Reports drift analysis every 100 records to the API
        - Posts all results to FastAPI for dashboard consumption

        ### Alert Manager (`alerting/alert_manager.py`)
        - Classifies anomaly scores into LOW/MEDIUM/HIGH severity levels
        - Validates ML alerts against physics-based rules (temp > 90°C, vibration > 1.5G)
        - Upgrades alert severity when both ML and rules agree
        - Persists all alerts to `storage/anomaly_logs.json` as NDJSON

        ### Drift Detection (`monitoring/drift_detection.py`)
        - Uses EvidentlyAI's DataDriftPreset with Kolmogorov-Smirnov tests
        - Compares current streaming data distribution against training reference
        - Reports drift share (% of features drifted) to API and logs

        ---

        ## 🎤 Interview Explanation

        ### 🔹 30-Second Pitch
        > Built a real-time ML system to detect industrial equipment failures by streaming simulated sensor data through Kafka, applying sliding window feature engineering, and using Isolation Forest with adaptive thresholds for anomaly detection — complete with multi-level alerting, drift monitoring, and a live dashboard.

        ### 🔹 2-Minute Deep Dive
        > Designed a production-style streaming ML pipeline where a multi-stage degradation simulator generates correlated sensor telemetry (temperature, vibration, humidity) ingested via Kafka. The consumer applies a 10-second sliding window to extract a 15-dimensional feature vector per second, which feeds an Isolation Forest model. The system uses adaptive thresholding (rolling mean − 2σ) with a rule-based fallback for edge cases. Anomalies trigger a multi-level alert system (LOW/MEDIUM/HIGH) with both ML and physics-based validation. EvidentlyAI monitors for concept drift against training baselines, while MLflow tracks model experiments. Results are served via a FastAPI backend with 8 endpoints and visualized on a premium Streamlit dashboard featuring live sensor trends, anomaly score timelines, alert distribution charts, correlation heatmaps, and drift status panels.

        ---

        ## 🚀 Future Enhancements
        - Edge deployment (ONNX / TensorRT)
        - Deep learning models (LSTM for temporal sequences)
        - Cloud deployment (AWS Kinesis / GCP Pub/Sub)
        - Real IoT hardware integration
        - Automated retraining pipeline on drift detection
        - Prometheus + Grafana metrics stack
        - Email/Slack alert notifications
