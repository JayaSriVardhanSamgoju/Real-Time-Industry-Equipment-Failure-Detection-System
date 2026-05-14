import os
import sys
# Add project root to path so utils can be found
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import streamlit as st
import pandas as pd
import numpy as np
import requests
import time
import plotly.express as px
import plotly.graph_objects as go
from plotly.subplots import make_subplots
from datetime import datetime
from utils.helpers import load_config

config = load_config()
API_URL = f"http://localhost:{config['api']['port']}"

st.set_page_config(
    page_title="Equipment Failure Detection — Live Monitor",
    layout="wide",
    page_icon="🏭",
    initial_sidebar_state="expanded"
)

# ──────────────────────────────────────────────
#  Premium Dark Theme CSS
# ──────────────────────────────────────────────
st.markdown("""
<style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

    /* Base styling */
    .stApp {
        font-family: 'Inter', sans-serif;
    }

    /* Header */
    .main-header {
        background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
        border: 1px solid #334155;
        border-radius: 16px;
        padding: 28px 32px;
        margin-bottom: 24px;
        position: relative;
        overflow: hidden;
    }
    .main-header::before {
        content: '';
        position: absolute;
        top: 0; left: 0; right: 0;
        height: 3px;
        background: linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899, #f97316);
    }
    .main-header h1 {
        color: #f1f5f9;
        font-size: 1.85em;
        font-weight: 700;
        margin: 0 0 4px 0;
        letter-spacing: -0.02em;
    }
    .main-header p {
        color: #94a3b8;
        font-size: 0.95em;
        margin: 0;
    }

    /* Metric Cards */
    .metric-row {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 16px;
        margin-bottom: 24px;
    }
    .metric-card {
        background: linear-gradient(145deg, #1e293b 0%, #0f172a 100%);
        border: 1px solid #334155;
        border-radius: 14px;
        padding: 22px 20px;
        text-align: center;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    .metric-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(0,0,0,0.3);
    }
    .metric-icon {
        font-size: 1.6em;
        margin-bottom: 6px;
    }
    .metric-value {
        font-size: 2em;
        font-weight: 700;
        color: #f1f5f9;
        margin: 4px 0;
        line-height: 1.1;
    }
    .metric-label {
        color: #94a3b8;
        font-size: 0.8em;
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 0.06em;
    }
    .metric-card.status-ok { border-top: 3px solid #22c55e; }
    .metric-card.status-warn { border-top: 3px solid #f59e0b; }
    .metric-card.status-danger { border-top: 3px solid #ef4444; }
    .metric-card.status-info { border-top: 3px solid #3b82f6; }

    /* Section headers */
    .section-header {
        color: #e2e8f0;
        font-size: 1.15em;
        font-weight: 600;
        margin: 20px 0 12px 0;
        padding-bottom: 8px;
        border-bottom: 1px solid #1e293b;
        display: flex;
        align-items: center;
        gap: 8px;
    }

    /* Alert cards */
    .alert-card {
        border-radius: 10px;
        padding: 12px 18px;
        margin-bottom: 8px;
        display: flex;
        align-items: center;
        gap: 14px;
        font-size: 0.88em;
        border-left: 4px solid;
        backdrop-filter: blur(10px);
    }
    .alert-high {
        background: rgba(239, 68, 68, 0.12);
        border-left-color: #ef4444;
        color: #fca5a5;
    }
    .alert-medium {
        background: rgba(245, 158, 11, 0.12);
        border-left-color: #f59e0b;
        color: #fcd34d;
    }
    .alert-low {
        background: rgba(34, 197, 94, 0.12);
        border-left-color: #22c55e;
        color: #86efac;
    }
    .alert-badge {
        font-weight: 700;
        font-size: 0.75em;
        padding: 3px 10px;
        border-radius: 20px;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        flex-shrink: 0;
    }
    .badge-high { background: #ef4444; color: white; }
    .badge-medium { background: #f59e0b; color: #1e293b; }
    .badge-low { background: #22c55e; color: #1e293b; }

    /* Status pill */
    .status-pill {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 4px 14px;
        border-radius: 20px;
        font-size: 0.8em;
        font-weight: 600;
    }
    .pill-ok { background: rgba(34,197,94,0.15); color: #22c55e; }
    .pill-danger { background: rgba(239,68,68,0.15); color: #ef4444; }
    .pill-dot {
        width: 8px; height: 8px;
        border-radius: 50%;
        display: inline-block;
        animation: pulse 2s infinite;
    }
    .dot-ok { background: #22c55e; }
    .dot-danger { background: #ef4444; }

    @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.4; }
    }

    /* Drift panel */
    .drift-panel {
        background: linear-gradient(145deg, #1e293b, #0f172a);
        border: 1px solid #334155;
        border-radius: 12px;
        padding: 18px 20px;
        margin-top: 8px;
    }
    .drift-ok { border-left: 4px solid #22c55e; }
    .drift-warn { border-left: 4px solid #f59e0b; }

    /* Info box */
    .info-box {
        background: rgba(59, 130, 246, 0.08);
        border: 1px solid rgba(59, 130, 246, 0.2);
        border-radius: 10px;
        padding: 14px 18px;
        color: #93c5fd;
        font-size: 0.88em;
        line-height: 1.5;
    }

    /* Hide Streamlit branding */
    #MainMenu { visibility: hidden; }
    footer { visibility: hidden; }
    .stDeployButton { display: none; }
</style>
""", unsafe_allow_html=True)

# ──────────────────────────────────────────────
#  Header
# ──────────────────────────────────────────────
st.markdown("""
<div class="main-header">
    <h1>🏭 Real-Time Equipment Failure Detection</h1>
    <p>Streaming Isolation Forest Anomaly Detection Pipeline — Live Monitoring Dashboard</p>
</div>
""", unsafe_allow_html=True)

# ──────────────────────────────────────────────
#  Sidebar
# ──────────────────────────────────────────────
with st.sidebar:
    st.markdown("### ⚙️ Dashboard Controls")
    refresh_rate = st.slider("Refresh Interval (sec)", 1, 10, config["dashboard"]["refresh_rate_sec"])
    show_raw = st.checkbox("Show Raw Data Table", False)
    show_correlation = st.checkbox("Show Correlation Matrix", True)

    st.markdown("---")
    st.markdown("### 📡 System Info")
    st.markdown(f"""
    <div class="info-box">
        <strong>API Endpoint:</strong> {API_URL}<br>
        <strong>Kafka:</strong> {config['kafka']['bootstrap_servers']}<br>
        <strong>Topic:</strong> {config['kafka']['sensor_topic']}<br>
        <strong>Window Size:</strong> {config['model']['window_size']}s<br>
        <strong>Contamination:</strong> {config['model']['contamination_rate']}
    </div>
    """, unsafe_allow_html=True)

    st.markdown("---")
    st.markdown("### 🏗️ Pipeline Architecture")
    st.markdown("""
    ```
    Sensor Sim → Kafka
         ↓
    Feature Engine (15-dim)
         ↓
    Isolation Forest + Rules
         ↓
    FastAPI → Dashboard
    ```
    """)

# ──────────────────────────────────────────────
#  API Fetcher
# ──────────────────────────────────────────────
def fetch(endpoint):
    try:
        r = requests.get(f"{API_URL}/{endpoint}", timeout=2)
        return r.json() if r.status_code == 200 else []
    except Exception:
        return []

# ──────────────────────────────────────────────
#  Plotly Dark Theme Template
# ──────────────────────────────────────────────
PLOT_LAYOUT = dict(
    paper_bgcolor="rgba(0,0,0,0)",
    plot_bgcolor="rgba(15,23,42,0.6)",
    font=dict(family="Inter", color="#94a3b8", size=12),
    margin=dict(l=30, r=20, t=45, b=30),
    xaxis=dict(gridcolor="rgba(51,65,85,0.4)", zerolinecolor="rgba(51,65,85,0.4)"),
    yaxis=dict(gridcolor="rgba(51,65,85,0.4)", zerolinecolor="rgba(51,65,85,0.4)"),
    legend=dict(bgcolor="rgba(0,0,0,0)", font=dict(size=11)),
)

placeholder = st.empty()

# ──────────────────────────────────────────────
#  Main Dashboard Loop
# ──────────────────────────────────────────────
while True:
    live_data = fetch("live_data/")
    anomalies = fetch("recent_anomalies/")
    metrics = fetch("system_metrics")
    drift_info = fetch("drift_report")
    alert_counts = fetch("alert_summary")

    with placeholder.container():

        # ── TOP METRICS ROW ──
        if metrics:
            anomaly_rate = metrics.get("anomaly_rate_percent", 0)
            status_class = "status-ok" if anomaly_rate < 10 else ("status-warn" if anomaly_rate < 25 else "status-danger")
            status_text = "NOMINAL" if anomaly_rate < 10 else ("WARNING" if anomaly_rate < 25 else "CRITICAL")
            pill_class = "pill-ok" if anomaly_rate < 10 else "pill-danger"
            dot_class = "dot-ok" if anomaly_rate < 10 else "dot-danger"

            throughput = metrics.get("throughput_records_per_sec", 0)
            if isinstance(throughput, (int, float)):
                throughput_str = f"{throughput:.1f}/s"
            else:
                throughput_str = str(throughput)

            st.markdown(f"""
            <div class="metric-row">
                <div class="metric-card {status_class}">
                    <div class="metric-icon">
                        <span class="status-pill {pill_class}">
                            <span class="pill-dot {dot_class}"></span> {status_text}
                        </span>
                    </div>
                    <div class="metric-value">{anomaly_rate:.1f}%</div>
                    <div class="metric-label">Anomaly Rate</div>
                </div>
                <div class="metric-card status-info">
                    <div class="metric-icon">📊</div>
                    <div class="metric-value">{metrics.get("total_records_processed", 0):,}</div>
                    <div class="metric-label">Records Processed</div>
                </div>
                <div class="metric-card status-warn">
                    <div class="metric-icon">⚠️</div>
                    <div class="metric-value">{metrics.get("total_anomalies_detected", 0):,}</div>
                    <div class="metric-label">Anomalies Detected</div>
                </div>
                <div class="metric-card status-info">
                    <div class="metric-icon">⚡</div>
                    <div class="metric-value">{throughput_str}</div>
                    <div class="metric-label">Throughput</div>
                </div>
            </div>
            """, unsafe_allow_html=True)

        if live_data:
            df = pd.DataFrame(live_data)
            df["timestamp"] = pd.to_datetime(df["timestamp"])

            # ── 📈 LIVE SENSOR TRENDS ──
            st.markdown('<div class="section-header">📈 Live Sensor Trends</div>', unsafe_allow_html=True)
            t1, t2, t3 = st.columns(3)

            sensor_configs = [
                ("temperature", "🌡️ Temperature (°C)", "#ef4444", "#fca5a5", t1),
                ("vibration", "⚙️ Vibration (G)", "#3b82f6", "#93c5fd", t2),
                ("humidity", "💧 Humidity (%)", "#22c55e", "#86efac", t3),
            ]

            for col_name, title, color, light_color, col_widget in sensor_configs:
                with col_widget:
                    fig = go.Figure()
                    fig.add_trace(go.Scatter(
                        x=df["timestamp"], y=df[col_name],
                        mode="lines",
                        line=dict(color=color, width=2),
                        fill="tozeroy",
                        fillcolor=f"rgba({int(color[1:3],16)},{int(color[3:5],16)},{int(color[5:7],16)},0.08)",
                        name=col_name.title(),
                        hovertemplate=f"<b>{col_name.title()}</b>: %{{y:.2f}}<br>%{{x}}<extra></extra>"
                    ))
                    fig.update_layout(
                        title=dict(text=title, font=dict(size=14, color="#e2e8f0")),
                        height=260,
                        **PLOT_LAYOUT
                    )
                    st.plotly_chart(fig, use_container_width=True)

            # ── 🔥 ANOMALY SCORE TIMELINE ──
            st.markdown('<div class="section-header">🔥 Anomaly Score Timeline</div>', unsafe_allow_html=True)

            fig_score = go.Figure()

            # Score markers — color-coded by severity
            colors = []
            for s in df["anomaly_score"]:
                if s < -0.6:
                    colors.append("#ef4444")
                elif s < -0.4:
                    colors.append("#f59e0b")
                elif s < -0.2:
                    colors.append("#22c55e")
                else:
                    colors.append("#3b82f6")

            fig_score.add_trace(go.Scatter(
                x=df["timestamp"], y=df["anomaly_score"],
                mode="lines+markers",
                marker=dict(color=colors, size=5, line=dict(width=0)),
                line=dict(color="rgba(148,163,184,0.4)", width=1),
                name="Anomaly Score",
                hovertemplate="<b>Score</b>: %{y:.4f}<br>%{x}<extra></extra>"
            ))

            if "dynamic_threshold" in df.columns:
                fig_score.add_trace(go.Scatter(
                    x=df["timestamp"], y=df["dynamic_threshold"],
                    mode="lines",
                    line=dict(color="#f59e0b", dash="dash", width=2),
                    name="Adaptive Threshold",
                    hovertemplate="<b>Threshold</b>: %{y:.4f}<extra></extra>"
                ))

            fig_score.update_layout(
                height=300,
                yaxis_title="Score (lower = more anomalous)",
                **PLOT_LAYOUT
            )
            st.plotly_chart(fig_score, use_container_width=True)

            # ── MIDDLE ROW: Alert Feed + Alert Distribution ──
            col_left, col_right = st.columns([3, 2])

            with col_left:
                st.markdown('<div class="section-header">⚠️ Real-Time Anomaly Feed</div>', unsafe_allow_html=True)
                if anomalies:
                    df_a = pd.DataFrame(anomalies)
                    for _, row in df_a.tail(8).iterrows():
                        level = row.get("alert_level", "LOW")
                        css = level.lower() if level in ["HIGH", "MEDIUM", "LOW"] else "low"
                        badge_css = f"badge-{css}"
                        ts = row["timestamp"]
                        if isinstance(ts, str) and "T" in ts:
                            ts = ts.split("T")[1][:8]

                        st.markdown(
                            f'<div class="alert-card alert-{css}">'
                            f'<span class="alert-badge {badge_css}">{level}</span>'
                            f'<span>{ts} &nbsp;|&nbsp; Score: {row["anomaly_score"]:.4f} '
                            f'&nbsp;|&nbsp; T={row["temperature"]:.1f}°C &nbsp; V={row["vibration"]:.3f}G</span>'
                            f'</div>',
                            unsafe_allow_html=True
                        )
                else:
                    st.markdown("""
                    <div style="background: rgba(34,197,94,0.1); border: 1px solid rgba(34,197,94,0.3);
                                border-radius: 10px; padding: 20px; text-align: center; color: #86efac;">
                        ✅ All systems nominal — no anomalies detected
                    </div>
                    """, unsafe_allow_html=True)

            with col_right:
                st.markdown('<div class="section-header">📊 Alert Distribution</div>', unsafe_allow_html=True)
                if alert_counts and isinstance(alert_counts, dict):
                    labels = []
                    values = []
                    clrs = []
                    color_map = {"HIGH": "#ef4444", "MEDIUM": "#f59e0b", "LOW": "#22c55e", "NONE": "#334155"}
                    for k in ["HIGH", "MEDIUM", "LOW", "NONE"]:
                        v = alert_counts.get(k, 0)
                        if v > 0:
                            labels.append(k)
                            values.append(v)
                            clrs.append(color_map[k])

                    if values:
                        fig_pie = go.Figure(data=[go.Pie(
                            labels=labels, values=values,
                            hole=0.55,
                            marker=dict(colors=clrs, line=dict(color="#0f172a", width=2)),
                            textinfo="label+percent",
                            textfont=dict(size=12, color="#e2e8f0"),
                            hovertemplate="<b>%{label}</b>: %{value} alerts (%{percent})<extra></extra>"
                        )])
                        fig_pie.update_layout(
                            height=280,
                            showlegend=False,
                            **{k: v for k, v in PLOT_LAYOUT.items() if k != "xaxis" and k != "yaxis"}
                        )
                        st.plotly_chart(fig_pie, use_container_width=True)
                    else:
                        st.info("No alert data yet.")
                else:
                    st.info("Waiting for alert data...")

            # ── 📊 SENSOR CORRELATION MATRIX ──
            if show_correlation:
                st.markdown('<div class="section-header">🔗 Sensor Correlation Matrix</div>', unsafe_allow_html=True)
                corr_cols = ["temperature", "vibration", "humidity", "anomaly_score"]
                corr_matrix = df[corr_cols].corr()
                fig_corr = px.imshow(
                    corr_matrix,
                    text_auto=".2f",
                    aspect="auto",
                    color_continuous_scale=[
                        [0, "#3b82f6"], [0.5, "#0f172a"], [1, "#ef4444"]
                    ],
                    labels=dict(color="Correlation"),
                )
                fig_corr.update_layout(
                    height=340,
                    title=dict(text="Feature Correlation Heatmap", font=dict(size=14, color="#e2e8f0")),
                    **PLOT_LAYOUT
                )
                fig_corr.update_traces(
                    textfont=dict(size=14, color="#e2e8f0"),
                )
                st.plotly_chart(fig_corr, use_container_width=True)

            # ── 📉 DRIFT & DISTRIBUTION INDICATORS ──
            st.markdown('<div class="section-header">📉 Distribution Drift Indicators</div>', unsafe_allow_html=True)

            dc1, dc2, dc3, dc4 = st.columns(4)

            with dc1:
                recent_temp = df["temperature"].tail(20)
                delta_temp = recent_temp.mean() - 70
                st.metric(
                    "🌡️ Temp Spread",
                    f"{recent_temp.std():.2f}°C",
                    delta=f"{delta_temp:.1f} from baseline",
                    delta_color="inverse"
                )

            with dc2:
                recent_vib = df["vibration"].tail(20)
                delta_vib = recent_vib.mean() - 0.5
                st.metric(
                    "⚙️ Vibration Spread",
                    f"{recent_vib.std():.3f}G",
                    delta=f"{delta_vib:.3f} from baseline",
                    delta_color="inverse"
                )

            with dc3:
                anomaly_pct = (df["is_anomaly"].sum() / len(df)) * 100
                st.metric(
                    "📊 Session Anomaly Rate",
                    f"{anomaly_pct:.1f}%",
                    delta=f"{'⚠ High' if anomaly_pct > 10 else '✓ Normal'}",
                    delta_color="inverse" if anomaly_pct > 10 else "normal"
                )

            with dc4:
                if drift_info and isinstance(drift_info, dict) and drift_info.get("checked_at", "N/A") != "N/A":
                    drift_pct = drift_info.get("drift_share", 0) * 100
                    drift_status = "⚠ Drift" if drift_info.get("drift_detected") else "✓ Stable"
                    st.metric(
                        "📉 Feature Drift",
                        f"{drift_pct:.0f}%",
                        delta=drift_status,
                        delta_color="inverse" if drift_info.get("drift_detected") else "normal"
                    )
                else:
                    st.metric("📉 Feature Drift", "N/A", delta="Awaiting check")

            # Drift detail panel
            if drift_info and isinstance(drift_info, dict) and drift_info.get("drift_detected"):
                st.markdown(f"""
                <div class="drift-panel drift-warn">
                    <strong style="color: #fcd34d;">⚠️ Data Drift Detected</strong>
                    <p style="color: #94a3b8; margin: 6px 0 0 0; font-size: 0.88em;">
                        {drift_info.get('drift_share', 0)*100:.0f}% of features have drifted from training baseline.
                        Last checked: {drift_info.get('checked_at', 'N/A')[:19]}
                    </p>
                </div>
                """, unsafe_allow_html=True)
            elif drift_info and isinstance(drift_info, dict) and drift_info.get("checked_at", "N/A") != "N/A":
                st.markdown("""
                <div class="drift-panel drift-ok">
                    <strong style="color: #86efac;">✅ Distributions Stable</strong>
                    <p style="color: #94a3b8; margin: 6px 0 0 0; font-size: 0.88em;">
                        No significant drift detected — model performance is reliable.
                    </p>
                </div>
                """, unsafe_allow_html=True)

            # ── 📋 RAW DATA TABLE ──
            if show_raw:
                st.markdown('<div class="section-header">📋 Raw Data Stream</div>', unsafe_allow_html=True)
                st.dataframe(
                    df.tail(50).style.format({
                        "anomaly_score": "{:.4f}",
                        "dynamic_threshold": "{:.4f}",
                        "temperature": "{:.2f}",
                        "vibration": "{:.3f}",
                        "humidity": "{:.2f}"
                    }),
                    use_container_width=True,
                    height=400
                )

        else:
            st.markdown("""
            <div style="background: linear-gradient(145deg, #1e293b, #0f172a);
                        border: 1px solid #334155; border-radius: 14px;
                        padding: 60px 40px; text-align: center; margin: 40px 0;">
                <div style="font-size: 3em; margin-bottom: 16px;">⏳</div>
                <h3 style="color: #e2e8f0; margin: 0 0 12px 0;">Waiting for Data Stream</h3>
                <p style="color: #94a3b8; max-width: 500px; margin: 0 auto; line-height: 1.6;">
                    Ensure all pipeline components are running:<br>
                    <code style="color: #93c5fd;">FastAPI</code> →
                    <code style="color: #93c5fd;">Inference Engine</code> →
                    <code style="color: #93c5fd;">Sensor Simulator</code>
                </p>
            </div>
            """, unsafe_allow_html=True)

    time.sleep(refresh_rate)