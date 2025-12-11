import { useState, useEffect, useCallback, useRef } from 'react';

// =============================================================================
// Types matching FastAPI WebSocket response
// =============================================================================
export interface TelemetryData {
    timestamp: string;
    sensor_id: string;
    metrics: {
        current_usage: number;
        solar_output: number;
        grid_dependency: number;
        temperature: number;
        humidity: number;
        uv_index: number;
    };
    status: {
        anomaly_detected: boolean;
        grid_status: 'stable' | 'high-load';
        solar_status: 'generating' | 'inactive';
    };
}

export interface UseWebSocketOptions {
    url?: string;
    autoConnect?: boolean;
    reconnectInterval?: number;
    maxReconnectAttempts?: number;
}

export interface UseWebSocketResult {
    data: TelemetryData | null;
    history: TelemetryData[];
    isConnected: boolean;
    error: string | null;
    connect: () => void;
    disconnect: () => void;
}

const DEFAULT_WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000/ws/stream';
const MAX_HISTORY = 60; // Keep last 60 data points for charts

/**
 * React hook for WebSocket connection to EcoPulse telemetry stream
 */
export function useWebSocket(options: UseWebSocketOptions = {}): UseWebSocketResult {
    const {
        url = DEFAULT_WS_URL,
        autoConnect = false,
        reconnectInterval = 3000,
        maxReconnectAttempts = 5,
    } = options;

    const [data, setData] = useState<TelemetryData | null>(null);
    const [history, setHistory] = useState<TelemetryData[]>([]);
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const wsRef = useRef<WebSocket | null>(null);
    const reconnectCountRef = useRef(0);
    const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const connect = useCallback(() => {
        // Clean up existing connection
        if (wsRef.current) {
            wsRef.current.close();
        }

        // Reset error and reconnect counter on manual connect
        setError(null);
        reconnectCountRef.current = 0;

        try {
            console.log('[WebSocket] Attempting connection to:', url);
            const ws = new WebSocket(url);
            wsRef.current = ws;

            ws.onopen = () => {
                console.log('[WebSocket] Connected successfully to', url);
                setIsConnected(true);
                setError(null);
                reconnectCountRef.current = 0;
            };

            ws.onmessage = (event) => {
                try {
                    const telemetry: TelemetryData = JSON.parse(event.data);
                    setData(telemetry);

                    // Add to history, keeping only the last MAX_HISTORY items
                    setHistory((prev) => {
                        const newHistory = [...prev, telemetry];
                        return newHistory.slice(-MAX_HISTORY);
                    });
                } catch (parseError) {
                    console.error('[WebSocket] Failed to parse message:', parseError);
                }
            };

            ws.onerror = (event) => {
                console.error('[WebSocket] Connection error:', event);
                // Don't set error here - wait for onclose which has more info
            };

            ws.onclose = (event) => {
                console.log('[WebSocket] Connection closed. Code:', event.code, 'Reason:', event.reason);
                setIsConnected(false);
                wsRef.current = null;

                // Only auto-reconnect if we were previously connected (not on initial failure)
                if (event.code !== 1000 && reconnectCountRef.current < maxReconnectAttempts) {
                    reconnectCountRef.current++;
                    const errorMsg = event.code === 1006
                        ? 'Connection failed - is the backend running?'
                        : `Disconnected (code: ${event.code})`;
                    setError(errorMsg);

                    console.log(`[WebSocket] Reconnecting in ${reconnectInterval}ms... (attempt ${reconnectCountRef.current}/${maxReconnectAttempts})`);

                    reconnectTimeoutRef.current = setTimeout(() => {
                        connect();
                    }, reconnectInterval);
                } else if (reconnectCountRef.current >= maxReconnectAttempts) {
                    setError('Max reconnection attempts reached. Click Connect to try again.');
                }
            };
        } catch (err) {
            console.error('[WebSocket] Failed to create connection:', err);
            setError('Failed to establish WebSocket connection');
        }
    }, [url, reconnectInterval, maxReconnectAttempts]);

    const disconnect = useCallback(() => {
        if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
            reconnectTimeoutRef.current = null;
        }

        if (wsRef.current) {
            wsRef.current.close();
            wsRef.current = null;
        }

        setIsConnected(false);
        reconnectCountRef.current = maxReconnectAttempts; // Prevent auto-reconnect
    }, [maxReconnectAttempts]);

    // Auto-connect on mount (if enabled)
    useEffect(() => {
        if (autoConnect) {
            connect();
        }

        // Cleanup on unmount
        return () => {
            disconnect();
        };
    }, [autoConnect, connect, disconnect]);

    return {
        data,
        history,
        isConnected,
        error,
        connect,
        disconnect,
    };
}
