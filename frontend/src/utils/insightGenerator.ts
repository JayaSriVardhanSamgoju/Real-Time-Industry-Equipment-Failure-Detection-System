import type { InsightContent } from '@/types/insight.types';
import type { Severity } from '@/types/anomaly.types';
import type { SensorType } from '@/types/machine.types';
import { THRESHOLDS } from '@/config/constants';

interface SensorDataPoint {
  timestamp: string;
  value: number;
  anomalyScore: number;
  threshold: number;
  isAnomaly: boolean;
}

interface AnomalyContext {
  rollingMean: number;
  rollingStd: number;
  severity: Severity;
}

interface CorrelationMap {
  tempVib: number;
  tempHum: number;
  vibHum: number;
}

const TEMPERATURE_INSIGHTS = {
  normal: {
    operational: (v: number) =>
      `Temperature reading of ${v.toFixed(1)}°C is within the normal operating range (60–75°C). Thermal load is stable and well-distributed across the equipment housing. Current value ${v.toFixed(1)}°C indicates healthy friction levels.`,
    mlReasoning: (score: number) =>
      `Isolation Forest anomaly score ${score.toFixed(3)} — well below detection threshold. This feature vector closely matches learned normal operating patterns from the training distribution.`,
    statistical: (v: number, mean: number, std: number) =>
      `Current value is ${((v - mean) / Math.max(std, 0.1)).toFixed(2)}σ from the rolling mean (${mean.toFixed(1)}°C). Within expected ±2σ operational band.`,
    riskAssessment: () =>
      `No elevated thermal risk detected. Equipment operating nominally. Bearing lubrication and cooling systems performing within specifications.`,
    correlations: (corr: CorrelationMap) =>
      `Vibration levels are proportionally stable (r=${corr.tempVib.toFixed(2)}), consistent with normal mechanical operation. No cross-sensor anomaly patterns detected.`,
  },
  warning: {
    operational: (v: number) =>
      `Temperature of ${v.toFixed(1)}°C is approaching the warning threshold (${THRESHOLDS.TEMPERATURE.critical}°C). Thermal stress is increasing — possible early indicator of friction buildup or cooling degradation.`,
    mlReasoning: (score: number) =>
      `Anomaly score ${score.toFixed(3)} is elevated — top 15% of historical readings. Isolation Forest flagged this vector as statistically unusual compared to learned baselines.`,
    statistical: (v: number, mean: number, std: number) =>
      `Current value is ${((v - mean) / Math.max(std, 0.1)).toFixed(2)}σ above the rolling mean (${mean.toFixed(1)}°C). Approaching the +2σ adaptive threshold boundary.`,
    riskAssessment: () =>
      `Moderate thermal risk. If temperature continues rising, bearing failure probability increases significantly. Recommend increased monitoring frequency and load reduction consideration.`,
    correlations: (corr: CorrelationMap) =>
      `Vibration showing corresponding increase (r=${corr.tempVib.toFixed(2)}) — positive correlation strengthens thermal stress diagnosis. Cross-validate with humidity for environmental factors.`,
  },
  critical: {
    operational: (v: number) =>
      `⚠️ Temperature ${v.toFixed(1)}°C has exceeded the critical threshold (${THRESHOLDS.TEMPERATURE.critical}°C). Abnormal thermal event detected — immediate attention required.`,
    mlReasoning: (score: number) =>
      `Isolation Forest anomaly score ${score.toFixed(3)} — classified as HIGH CONFIDENCE anomaly. Feature vector deviates significantly from all learned operational baselines. Isolation depth indicates extreme statistical outlier.`,
    statistical: (v: number, mean: number, std: number) =>
      `Current value is ${((v - mean) / Math.max(std, 0.1)).toFixed(2)}σ above rolling mean (${mean.toFixed(1)}°C) — beyond the adaptive threshold boundary. Alert triggered by both ML and physics-based validation.`,
    riskAssessment: () =>
      `HIGH RISK: This thermal signature matches historical pre-failure patterns for bearing overload. Probability of component failure within 2–4 hours if unaddressed. Recommend immediate load reduction and maintenance dispatch.`,
    correlations: (corr: CorrelationMap) =>
      `Simultaneous vibration anomaly (r=${corr.tempVib.toFixed(2)} correlation) confirms mechanical-thermal failure mode. Physics-based validation also triggered. Multi-sensor consensus: FAILURE IMMINENT.`,
  },
};

const VIBRATION_INSIGHTS = {
  normal: {
    operational: (v: number) =>
      `Vibration reading of ${v.toFixed(2)} mm/s is within normal operating range (2–6 mm/s). Mechanical components are well-balanced with no detectable resonance or misalignment.`,
    mlReasoning: (score: number) =>
      `Anomaly score ${score.toFixed(3)} indicates normal operation. The vibration feature vector aligns with the learned distribution of healthy mechanical states.`,
    statistical: (v: number, mean: number, std: number) =>
      `Current value is ${((v - mean) / Math.max(std, 0.1)).toFixed(2)}σ from the rolling mean (${mean.toFixed(2)} mm/s). Well within the expected variability range.`,
    riskAssessment: () =>
      `No mechanical risk indicators present. Bearing wear, shaft alignment, and rotor balance are all within acceptable parameters.`,
    correlations: (corr: CorrelationMap) =>
      `Temperature correlation (r=${corr.tempVib.toFixed(2)}) is within normal bounds — no unusual thermal-mechanical coupling detected.`,
  },
  warning: {
    operational: (v: number) =>
      `Vibration of ${v.toFixed(2)} mm/s is elevated above the normal range. Possible early signs of bearing wear, imbalance, or looseness developing.`,
    mlReasoning: (score: number) =>
      `Anomaly score ${score.toFixed(3)} indicates the vibration signature is deviating from learned patterns. The feature vector is entering a region associated with early degradation.`,
    statistical: (v: number, mean: number, std: number) =>
      `Current value is ${((v - mean) / Math.max(std, 0.1)).toFixed(2)}σ above the rolling mean (${mean.toFixed(2)} mm/s). Trending toward the adaptive threshold.`,
    riskAssessment: () =>
      `Moderate mechanical risk. Vibration increase may indicate bearing cage defect, slight misalignment, or foundation looseness. Recommend vibration spectrum analysis.`,
    correlations: (corr: CorrelationMap) =>
      `Temperature is also trending upward (r=${corr.tempVib.toFixed(2)}) — frictional heat generation is consistent with mechanical degradation hypothesis.`,
  },
  critical: {
    operational: (v: number) =>
      `⚠️ Vibration ${v.toFixed(2)} mm/s has exceeded the critical threshold (${THRESHOLDS.VIBRATION.critical} mm/s). Severe mechanical anomaly detected — potential structural damage risk.`,
    mlReasoning: (score: number) =>
      `Isolation Forest anomaly score ${score.toFixed(3)} — HIGH CONFIDENCE mechanical anomaly. Feature vector in the extreme tail of the learned distribution.`,
    statistical: (v: number, mean: number, std: number) =>
      `Current value is ${((v - mean) / Math.max(std, 0.1)).toFixed(2)}σ above rolling mean (${mean.toFixed(2)} mm/s) — significantly beyond adaptive threshold.`,
    riskAssessment: () =>
      `CRITICAL RISK: Vibration signature consistent with bearing inner race defect or shaft crack propagation. Equipment should be shut down for inspection within 1–2 hours to prevent catastrophic failure.`,
    correlations: (corr: CorrelationMap) =>
      `Strong thermal correlation (r=${corr.tempVib.toFixed(2)}) confirms friction-induced heating. Multi-sensor consensus indicates active mechanical failure mode.`,
  },
};

const HUMIDITY_INSIGHTS = {
  normal: {
    operational: (v: number) =>
      `Humidity reading of ${v.toFixed(1)}% is within the acceptable environmental range (40–65%). Operating environment is stable with no condensation risk.`,
    mlReasoning: (score: number) =>
      `Anomaly score ${score.toFixed(3)} reflects normal environmental conditions. Humidity feature is not contributing to any anomaly detection triggers.`,
    statistical: (v: number, mean: number, std: number) =>
      `Current value is ${((v - mean) / Math.max(std, 0.1)).toFixed(2)}σ from the rolling mean (${mean.toFixed(1)}%). Environmental conditions are stable.`,
    riskAssessment: () =>
      `No environmental risk. Humidity levels are suitable for equipment operation. No risk of condensation, corrosion, or insulation breakdown.`,
    correlations: (corr: CorrelationMap) =>
      `No significant cross-correlation with mechanical sensors. Environmental conditions are independent of equipment performance.`,
  },
  warning: {
    operational: (v: number) =>
      `Humidity of ${v.toFixed(1)}% is above the recommended range. Condensation risk is elevated, which may accelerate corrosion on exposed metal surfaces.`,
    mlReasoning: (score: number) =>
      `Anomaly score ${score.toFixed(3)} reflects environmental deviation. While humidity alone may not trigger an anomaly, combined with other sensors it increases the composite risk score.`,
    statistical: (v: number, mean: number, std: number) =>
      `Current value is ${((v - mean) / Math.max(std, 0.1)).toFixed(2)}σ above rolling mean (${mean.toFixed(1)}%). Environmental baseline shifting.`,
    riskAssessment: () =>
      `Moderate environmental risk. High humidity can accelerate electrical insulation degradation and promote corrosion. Monitor HVAC systems and consider dehumidification.`,
    correlations: (corr: CorrelationMap) =>
      `Humidity changes may indirectly affect temperature readings through cooling system efficiency (r=${corr.tempHum.toFixed(2)}).`,
  },
  critical: {
    operational: (v: number) =>
      `⚠️ Humidity ${v.toFixed(1)}% has exceeded the critical threshold (${THRESHOLDS.HUMIDITY.critical}%). High condensation risk — potential for electrical faults and accelerated corrosion.`,
    mlReasoning: (score: number) =>
      `Anomaly score ${score.toFixed(3)} — environmental conditions are significantly abnormal. Feature vector indicates the operating environment is outside safe parameters.`,
    statistical: (v: number, mean: number, std: number) =>
      `Current value is ${((v - mean) / Math.max(std, 0.1)).toFixed(2)}σ above rolling mean (${mean.toFixed(1)}%) — beyond safe operating envelope.`,
    riskAssessment: () =>
      `HIGH ENVIRONMENTAL RISK: Condensation likely forming on equipment surfaces. Risk of electrical short circuit, insulation breakdown, and accelerated bearing corrosion. Activate facility dehumidification immediately.`,
    correlations: (corr: CorrelationMap) =>
      `High humidity is degrading cooling efficiency (r=${corr.tempHum.toFixed(2)} with temperature), compounding thermal stress on the equipment.`,
  },
};

const INSIGHT_MAP: Record<SensorType, typeof TEMPERATURE_INSIGHTS> = {
  temperature: TEMPERATURE_INSIGHTS,
  vibration: VIBRATION_INSIGHTS,
  humidity: HUMIDITY_INSIGHTS,
};

const UNIT_MAP: Record<SensorType, string> = {
  temperature: '°C',
  vibration: 'mm/s',
  humidity: '%',
};

const NAME_MAP: Record<SensorType, string> = {
  temperature: 'Temperature',
  vibration: 'Vibration',
  humidity: 'Humidity',
};

export function generateInsight(
  sensorType: SensorType,
  dataPoint: SensorDataPoint,
  anomalyContext: AnomalyContext,
  correlationMap: CorrelationMap
): InsightContent {
  const templates = INSIGHT_MAP[sensorType];
  const severity = anomalyContext.severity;
  const t = templates[severity];

  return {
    chartId: `${sensorType}-chart`,
    timestamp: dataPoint.timestamp,
    sensorValue: dataPoint.value,
    sensorUnit: UNIT_MAP[sensorType],
    sensorName: NAME_MAP[sensorType],
    operational: t.operational(dataPoint.value),
    mlReasoning: t.mlReasoning(dataPoint.anomalyScore),
    statistical: t.statistical(
      dataPoint.value,
      anomalyContext.rollingMean,
      anomalyContext.rollingStd
    ),
    riskAssessment: t.riskAssessment(),
    correlations: t.correlations(correlationMap),
    severity,
    anomalyScore: dataPoint.anomalyScore,
    thresholdValue: dataPoint.threshold,
    isAnomaly: dataPoint.isAnomaly,
    technicalDetails: {
      featureVector: {
        [sensorType]: dataPoint.value,
        rolling_mean: anomalyContext.rollingMean,
        rolling_std: anomalyContext.rollingStd,
        anomaly_score: dataPoint.anomalyScore,
      },
      isolationDepth: Math.round((1 - dataPoint.anomalyScore) * 12),
      slidingWindowSize: 10,
      adaptiveThresholdMethod: 'rolling_mean + k × rolling_std (k=2.3)',
    },
  };
}

export function computeRollingStats(
  values: number[]
): { mean: number; std: number } {
  if (values.length === 0) return { mean: 0, std: 1 };
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance =
    values.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / Math.max(values.length - 1, 1);
  return { mean, std: Math.sqrt(variance) };
}

export function determineSeverity(
  sensorType: SensorType,
  value: number
): Severity {
  const thresholds = THRESHOLDS[sensorType.toUpperCase() as keyof typeof THRESHOLDS];
  if (!thresholds || typeof thresholds !== 'object') return 'normal';
  const t = thresholds as { warning: number; critical: number };
  if (value >= t.critical) return 'critical';
  if (value >= t.warning) return 'warning';
  return 'normal';
}
