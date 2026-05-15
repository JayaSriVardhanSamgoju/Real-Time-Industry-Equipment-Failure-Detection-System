import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { slideInRight } from '@/animations/variants';
import { X, Server, Cpu, Database, Network, AlertTriangle, Monitor, Activity } from 'lucide-react';

export interface ComponentDetails {
  id: string;
  name: string;
  tech: string;
  purpose: string;
  howItWorks: string;
  inputs: string;
  outputs: string;
  performance: string;
}

const componentDetailsData: Record<string, ComponentDetails> = {
  sensor: {
    id: 'sensor',
    name: 'Sensor Simulator',
    tech: 'Python Generator',
    purpose: 'Simulates high-frequency industrial sensor readings',
    howItWorks: 'Generates realistic multivariate data (temp, vibration, humidity) with injected degradation patterns and noise to simulate real-world mechanical wear.',
    inputs: 'None (Data Generator)',
    outputs: '{ timestamp, temperature, vibration, humidity, equipment_id }',
    performance: 'Generates 100+ events/sec. Configurable drift rates.',
  },
  kafka_prod: {
    id: 'kafka_prod',
    name: 'Kafka Producer',
    tech: 'confluent-kafka-python',
    purpose: 'Ingests raw sensor data reliably',
    howItWorks: 'Serializes JSON payloads and publishes to the "sensor_data" topic with high throughput and at-least-once delivery semantics.',
    inputs: 'Raw sensor JSON',
    outputs: 'Kafka topic: sensor_data',
    performance: 'Asynchronous publishing, <5ms overhead',
  },
  kafka_broker: {
    id: 'kafka_broker',
    name: 'Kafka Broker',
    tech: 'Apache Kafka',
    purpose: 'Distributed event streaming platform',
    howItWorks: 'Buffers incoming data streams, providing fault tolerance, replication, and decoupling of data ingestion from processing.',
    inputs: 'sensor_data stream',
    outputs: 'sensor_data stream (partitioned)',
    performance: 'Millions of msg/sec throughput. Configurable retention.',
  },
  consumer: {
    id: 'consumer',
    name: 'Stream Consumer',
    tech: 'confluent-kafka-python',
    purpose: 'Subscribes and processes data streams',
    howItWorks: 'Polls the broker in real-time, deserializes payloads, and batches them for the feature engineering pipeline.',
    inputs: 'Kafka topic: sensor_data',
    outputs: 'Python dictionary batches',
    performance: 'Poll interval ~100ms. Auto-commit enabled.',
  },
  feature_eng: {
    id: 'feature_eng',
    name: 'Feature Engineering',
    tech: 'pandas / NumPy',
    purpose: 'Extracts ML-ready features from raw data',
    howItWorks: 'Maintains a sliding window of recent readings to compute rolling statistics (mean, std, max) and cross-sensor ratios.',
    inputs: 'Raw data batches',
    outputs: 'Feature vector: [temp, vib, hum, roll_mean, roll_std, ratio]',
    performance: 'Vectorized operations. <2ms per batch.',
  },
  isolation_forest: {
    id: 'isolation_forest',
    name: 'Isolation Forest',
    tech: 'scikit-learn IsolationForest',
    purpose: 'Unsupervised anomaly detection',
    howItWorks: 'Builds an ensemble of random decision trees. Anomalous points are isolated near the root because they are rare and statistically different.',
    inputs: 'Feature vector (normalized)',
    outputs: 'anomaly_score: float (0.0 to 1.0)',
    performance: 'Inference latency: ~12ms. Tracked via MLflow.',
  },
  alert_system: {
    id: 'alert_system',
    name: 'Alert System',
    tech: 'Python Service',
    purpose: 'Validates ML scores against physical rules',
    howItWorks: 'Combines ML anomaly scores with physics-based thresholds and computes dynamic adaptive thresholds using rolling baselines.',
    inputs: 'Raw data + anomaly_score',
    outputs: 'is_anomaly (bool), alert_level (enum)',
    performance: 'Rule evaluation <1ms.',
  },
  fastapi: {
    id: 'fastapi',
    name: 'FastAPI Backend',
    tech: 'FastAPI (Python)',
    purpose: 'Serves predictions to the dashboard',
    howItWorks: 'Maintains an in-memory ring buffer of recent predictions and exposes RESTful endpoints for live data, metrics, and alerts.',
    inputs: 'Processed PredictionResults',
    outputs: 'JSON REST APIs (/live_data, /recent_anomalies)',
    performance: 'Async endpoints. Uvicorn ASGI server.',
  },
};

interface Props {
  nodeId: string | null;
  onClose: () => void;
}

export const ComponentDetailPanel: React.FC<Props> = ({ nodeId, onClose }) => {
  const details = nodeId ? componentDetailsData[nodeId] : null;

  const getIcon = (id: string) => {
    switch (id) {
      case 'sensor': return <Activity className="w-5 h-5 text-cyan" />;
      case 'kafka_prod':
      case 'consumer': return <Network className="w-5 h-5 text-blue" />;
      case 'kafka_broker': return <Database className="w-5 h-5 text-blue" />;
      case 'feature_eng': return <Cpu className="w-5 h-5 text-amber" />;
      case 'isolation_forest': return <Server className="w-5 h-5 text-purple-400" />;
      case 'alert_system': return <AlertTriangle className="w-5 h-5 text-red" />;
      case 'fastapi': return <Server className="w-5 h-5 text-green" />;
      default: return <Monitor className="w-5 h-5 text-text-primary" />;
    }
  };

  return (
    <AnimatePresence>
      {details && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            onClick={onClose}
          />
          <motion.div
            variants={slideInRight}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="fixed right-0 top-0 bottom-0 w-96 bg-bg-surface border-l border-bg-border z-50 overflow-y-auto"
          >
            <div className="p-5">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-bg-border">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded bg-bg-elevated border border-bg-border">
                    {getIcon(details.id)}
                  </div>
                  <div>
                    <h2 className="font-display font-bold text-lg text-text-primary">
                      {details.name}
                    </h2>
                    <span className="text-xs font-mono text-cyan">{details.tech}</span>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded hover:bg-bg-elevated text-text-muted hover:text-text-primary transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-[10px] font-display uppercase tracking-wider text-text-muted mb-2">Purpose</h3>
                  <p className="text-sm font-body text-text-secondary">{details.purpose}</p>
                </div>
                
                <div>
                  <h3 className="text-[10px] font-display uppercase tracking-wider text-text-muted mb-2">How It Works</h3>
                  <div className="p-3 rounded-card bg-bg-elevated border border-bg-border text-sm font-body text-text-secondary leading-relaxed">
                    {details.howItWorks}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <h3 className="text-[10px] font-display uppercase tracking-wider text-text-muted mb-2">Inputs</h3>
                    <div className="font-mono text-xs text-amber p-2 rounded bg-amber/5 border border-amber/10">
                      {details.inputs}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-[10px] font-display uppercase tracking-wider text-text-muted mb-2">Outputs</h3>
                    <div className="font-mono text-xs text-green p-2 rounded bg-green/5 border border-green/10">
                      {details.outputs}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-[10px] font-display uppercase tracking-wider text-text-muted mb-2">Performance</h3>
                  <div className="flex items-center gap-2 text-sm text-text-secondary font-body">
                    <Activity className="w-4 h-4 text-cyan" />
                    {details.performance}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
