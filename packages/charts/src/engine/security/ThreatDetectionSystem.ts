import { EventEmitter } from 'events';

// ============================================================================
// Types & Interfaces
// ============================================================================

interface ThreatSignature {
  id: string;
  name: string;
  pattern: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  enabled: boolean;
  createdAt: Date;
}

interface AnomalyDetectionModel {
  id: string;
  name: string;
  type: 'statistical' | 'ml' | 'behavioral';
  threshold: number;
  sensitivity: number;
  enabled: boolean;
  trainingData?: Record<string, any>;
}

interface DetectedThreat {
  id: string;
  timestamp: Date;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  source: string;
  description: string;
  indicators: string[];
  confidence: number;
  status: 'detected' | 'investigating' | 'confirmed' | 'resolved';
}

interface Anomaly {
  id: string;
  timestamp: Date;
  metric: string;
  expectedValue: number;
  actualValue: number;
  deviation: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'new' | 'investigating' | 'resolved';
}

interface PatternMatch {
  id: string;
  timestamp: Date;
  pattern: string;
  matchedData: Record<string, any>;
  confidence: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

interface RealTimeAlert {
  id: string;
  timestamp: Date;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  actionRequired: boolean;
  recipients: string[];
}

interface IncidentResponse {
  id: string;