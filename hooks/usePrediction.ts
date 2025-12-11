import { useState, useEffect, useCallback } from 'react';
import {
    fetchPrediction,
    checkHealth,
    generateMockUsageData,
    PredictionResponse
} from '@/lib/energyApi';

interface UsePredictionOptions {
    autoFetch?: boolean;
    sensorId?: string;
    pollingInterval?: number; // in milliseconds, 0 to disable
}

interface UsePredictionResult {
    prediction: PredictionResponse | null;
    loading: boolean;
    error: string | null;
    backendAvailable: boolean;
    refresh: () => Promise<void>;
}

/**
 * Hook to fetch AI energy predictions from the FastAPI backend
 */
export function usePrediction(options: UsePredictionOptions = {}): UsePredictionResult {
    const {
        autoFetch = true,
        sensorId = 'ecopulse-main',
        pollingInterval = 0
    } = options;

    const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [backendAvailable, setBackendAvailable] = useState(false);

    // Check backend health
    useEffect(() => {
        const checkBackend = async () => {
            try {
                const health = await checkHealth();
                setBackendAvailable(health.model_loaded);
            } catch {
                setBackendAvailable(false);
            }
        };
        checkBackend();
    }, []);

    // Fetch prediction
    const refresh = useCallback(async () => {
        if (!backendAvailable) {
            setError('Backend not available');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Generate mock usage data (in production, this would come from sensors)
            const usageData = generateMockUsageData();
            const result = await fetchPrediction(usageData, sensorId);
            setPrediction(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch prediction');
        } finally {
            setLoading(false);
        }
    }, [backendAvailable, sensorId]);

    // Auto-fetch on mount and when backend becomes available
    useEffect(() => {
        if (autoFetch && backendAvailable) {
            refresh();
        }
    }, [autoFetch, backendAvailable, refresh]);

    // Polling (if enabled)
    useEffect(() => {
        if (pollingInterval > 0 && backendAvailable) {
            const interval = setInterval(refresh, pollingInterval);
            return () => clearInterval(interval);
        }
    }, [pollingInterval, backendAvailable, refresh]);

    return {
        prediction,
        loading,
        error,
        backendAvailable,
        refresh,
    };
}
