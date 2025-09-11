"use client";
import { useEffect, useState, useCallback } from "react";

/**
 * Custom WebSocket hook for managing connection lifecycle.
 *
 *
 * @param {string} url - The WebSocket URL.
 * @param {boolean} [autoReconnect=true] - Whether to automatically reconnect on disconnect.
 * @param {number} [reconnectInterval=5000] - The interval (in ms) between reconnection attempts.
 *
 * @returns {{
 *   ws: WebSocket | null; // WebSocket instance, or null if not connected.
 *   isConnected: boolean; // True if the WebSocket is connected.
 *   error: string | null; // Error message, or null if no error occurred.
 *   closeWebSocket: () => void; // Function to manually close the WebSocket connection.
 * }}
 */

const useWebSocket = (
  url, // WebSocket URL
  autoReconnect = true, // Automatically try to reconnect
  reconnectInterval = 5000 // Interval between reconnection attempts
) => {
  const [isConnected, setIsConnected] = useState(false);
  const [ws, setWs] = useState(null); // Store WebSocket instance
  const [error, setError] = useState(null);

  // ---------------------------------------------
  // Function to initialize WebSocket connection
  // ---------------------------------------------
  const connectWebSocket = useCallback(() => {
    if (!url) return;

    const wsInstance = new WebSocket(url);
    setWs(wsInstance); // Store WebSocket instance

    // When WebSocket is opened
    wsInstance.onopen = () => {
      console.log(`websocket for ${url} connected `);
      setIsConnected(true);
    };

    // When WebSocket is closed
    wsInstance.onclose = () => {
      console.log(`websocket for ${url} disconnected `);
      setIsConnected(false);
      // Attempt to reconnect if autoReconnect is enabled
      if (autoReconnect) {
        setTimeout(() => connectWebSocket(), reconnectInterval);
      }
    };

    // Handle connection error
    wsInstance.onerror = (e) => {
      console.error("WebSocket error", e);
      setError(e);
    };
  }, [url, autoReconnect, reconnectInterval]);

  // Initialize WebSocket connection on mount and when URL changes
  useEffect(() => {
    if (url) {
      connectWebSocket();
    }

    // Clean up WebSocket connection on unmount
    return () => {
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [url]);

  // Function to close the WebSocket connection
  const closeWebSocket = useCallback(() => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.close();
    }
  }, [ws]);

  return {
    ws,
    isConnected, // Boolean to track connection status
    error, // Error object if any WebSocket error occurs
    closeWebSocket, // Function to manually close WebSocket
  };
};

export default useWebSocket;
