"use client";
import { useEffect, useState, useCallback } from "react";

interface UseWebSocketOptions {
  autoReconnect?: boolean;
  reconnectInterval?: number;
}

interface UseWebSocketReturn {
  ws: WebSocket | null;
  isConnected: boolean;
  error: Event | null;
  closeWebSocket: () => void;
  sendMessage: (message: string | ArrayBufferLike | Blob | ArrayBufferView) => void;
  reconnect: () => void;
}

const useWebSocket = (
  url: string,
  { autoReconnect = true, reconnectInterval = 5000 }: UseWebSocketOptions = {}
): UseWebSocketReturn => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [error, setError] = useState<Event | null>(null);

  const connectWebSocket = useCallback(() => {
    if (!url) return;

    const wsInstance = new WebSocket(url);
    setWs(wsInstance);

    wsInstance.onopen = () => {
      console.log(`WebSocket for ${url} connected`);
      setIsConnected(true);
      setError(null);
    };

    wsInstance.onclose = () => {
      console.log(`WebSocket for ${url} disconnected`);
      setIsConnected(false);
      if (autoReconnect) {
        setTimeout(() => connectWebSocket(), reconnectInterval);
      }
    };

    wsInstance.onerror = (e: Event) => {
      console.error("WebSocket error", e);
      setError(e);
    };
  }, [url, autoReconnect, reconnectInterval]);

  const closeWebSocket = useCallback(() => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.close();
    }
  }, [ws]);

  const sendMessage = useCallback((message: string | ArrayBufferLike | Blob | ArrayBufferView) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(message);
    } else {
      console.warn("WebSocket is not connected. Cannot send message.");
    }
  }, [ws]);

  const reconnect = useCallback(() => {
    if (ws) {
      ws.close();
    }
    connectWebSocket();
  }, [ws, connectWebSocket]);

  useEffect(() => {
    if (url) {
      connectWebSocket();
    }

    return () => {
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [url, connectWebSocket]);

  return {
    ws,
    isConnected,
    error,
    closeWebSocket,
    sendMessage,
    reconnect,
  };
};

export default useWebSocket;
