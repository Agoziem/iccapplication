"use client";
import { useEffect, useState, useCallback, useRef } from "react";

interface UseWebSocketReturn {
  ws: WebSocket | null;
  isConnected: boolean;
  error: Event | null;
  closeWebSocket: () => void;
}

const useWebSocket = (
  url: string | null, // WebSocket URL
  autoReconnect: boolean = true, // Automatically try to reconnect
  reconnectInterval: number = 5000 // Interval between reconnection attempts
): UseWebSocketReturn => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [ws, setWs] = useState<WebSocket | null>(null); // Store WebSocket instance
  const [error, setError] = useState<Event | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  // ---------------------------------------------
  // Function to initialize WebSocket connection
  // ---------------------------------------------
  const connectWebSocket = useCallback(() => {
    if (!url) return;

    // Clear any existing timeout
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    // Close existing connection if any
    if (
      wsRef.current &&
      wsRef.current.readyState === WebSocket.OPEN &&
      wsRef.current.url !== url
    ) {
      wsRef.current.close();
    }

    const wsInstance = new WebSocket(url);
    wsRef.current = wsInstance;
    setWs(wsInstance); // Store WebSocket instance

    // When WebSocket is opened
    wsInstance.onopen = () => {
      console.log(`WebSocket for ${url} connected`);
      setIsConnected(true);
      setError(null);
    };

    // When WebSocket is closed
    wsInstance.onclose = (event: CloseEvent) => {
      console.log(`WebSocket for ${url} disconnected`, event.reason);
      setIsConnected(false);

      // Attempt to reconnect if autoReconnect is enabled
      if (autoReconnect && !event.wasClean) {
        reconnectTimeoutRef.current = setTimeout(() => {
          connectWebSocket();
        }, reconnectInterval);
      }
    };

    // Handle connection error
    wsInstance.onerror = (event: Event) => {
      console.error("WebSocket error", event);
      setError(event);
    };
  }, [url, autoReconnect, reconnectInterval]);

  // Initialize WebSocket connection on mount and when URL changes
  useEffect(() => {
    if (url) {
      connectWebSocket();
    }

    // Clean up WebSocket connection on unmount
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
      if (wsRef.current && wsRef.current.readyState !== WebSocket.CLOSED) {
        wsRef.current.close();
      }
    };
  }, [connectWebSocket]);

  // Function to close the WebSocket connection
  const closeWebSocket = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    if (wsRef.current && wsRef.current.readyState !== WebSocket.CLOSED) {
      wsRef.current.close();
    }
  }, []);

  return {
    ws,
    isConnected, // Boolean to track connection status
    error, // Error object if any WebSocket error occurs
    closeWebSocket, // Function to manually close WebSocket
  };
};

export default useWebSocket;
