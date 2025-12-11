/**
 * EcoPulse Energy API Client
 * Connects frontend to FastAPI backend for AI predictions
 */

// =============================================================================
// API Configuration
// =============================================================================
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// =============================================================================
// Types (matching FastAPI Pydantic models)
// =============================================================================
export interface PredictionRequest {
  recent_usage: number[];
  sensor_id: string;
}

export interface PredictionResponse {
  sensor_id: string;
  timestamp: string;
  predicted_usage: number;
  anomaly_detected: boolean;
  anomaly_severity: 'low' | 'medium' | 'high' | null;
  confidence_score: number;
}

export interface HealthResponse {
  status: string;
  model_loaded: boolean;
  model_version: string;
  api_version: string;
  timestamp: string;
}

export interface BatchPredictionRequest {
  sensors: PredictionRequest[];
}

// =============================================================================
// API Functions
// =============================================================================

/**
 * Check if the backend API is healthy and model is loaded
 */
export async function checkHealth(): Promise<HealthResponse> {
  const response = await fetch(`${API_BASE_URL}/health`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    throw new Error(`Health check failed: ${response.status}`);
  }

  return response.json();
}

/**
 * Get AI prediction for a single sensor's energy usage
 */
export async function fetchPrediction(
  recentUsage: number[],
  sensorId: string = 'main-facility'
): Promise<PredictionResponse> {
  const request: PredictionRequest = {
    recent_usage: recentUsage,
    sensor_id: sensorId,
  };

  const response = await fetch(`${API_BASE_URL}/predict`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Unknown error' }));
    throw new Error(error.detail || `Prediction failed: ${response.status}`);
  }

  return response.json();
}

/**
 * Get AI predictions for multiple sensors in a batch
 */
export async function fetchBatchPredictions(
  sensors: { recentUsage: number[]; sensorId: string }[]
): Promise<PredictionResponse[]> {
  const request: BatchPredictionRequest = {
    sensors: sensors.map((s) => ({
      recent_usage: s.recentUsage,
      sensor_id: s.sensorId,
    })),
  };

  const response = await fetch(`${API_BASE_URL}/predict/batch`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Unknown error' }));
    throw new Error(error.detail || `Batch prediction failed: ${response.status}`);
  }

  return response.json();
}

/**
 * Generate mock energy usage data for testing predictions
 * Returns 24 hours of simulated kWh readings
 */
export function generateMockUsageData(): number[] {
  const baseLoad = 150; // Base load in kWh
  const data: number[] = [];
  
  for (let hour = 0; hour < 24; hour++) {
    // Add daily pattern: higher during business hours
    let multiplier = 1;
    if (hour >= 9 && hour <= 17) {
      multiplier = 1.5; // 50% higher during work hours
    } else if (hour >= 18 && hour <= 21) {
      multiplier = 1.2; // 20% higher in evening
    } else if (hour >= 0 && hour <= 5) {
      multiplier = 0.6; // 40% lower at night
    }
    
    // Add some randomness
    const noise = (Math.random() - 0.5) * 20;
    data.push(Math.round((baseLoad * multiplier + noise) * 100) / 100);
  }
  
  return data;
}
