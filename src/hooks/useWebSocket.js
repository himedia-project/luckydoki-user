import { useState, useEffect } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { API_URL } from "../config/apiConfig";

export const useWebSocket = (userEmail, accessToken) => {
  const [stompClient, setStompClient] = useState(null);
  const [connected, setConnected] = useState(false);

  const connect = (e) => {
    e.preventDefault();
    if (userEmail && !stompClient) {
      const client = new Client({
        webSocketFactory: () => new SockJS(`${API_URL}/ws-stomp`),
        connectHeaders: {
          "X-Authorization": `Bearer ${accessToken}`,
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        onConnect: () => {
          console.log("WebSocket Connected!");
          setConnected(true);
        },
        onDisconnect: () => {
          console.log("WebSocket Disconnected!");
          setConnected(false);
        },
        onStompError: (frame) => {
          console.error("Broker reported error:", frame.headers["message"]);
        },
      });

      try {
        client.activate();
        setStompClient(client);
      } catch (error) {
        console.error("Error activating STOMP client:", error);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (stompClient) {
        try {
          stompClient.deactivate();
          setStompClient(null);
          setConnected(false);
        } catch (error) {
          console.error("연결종료 에러 발생", error);
        }
      }
    };
  }, [stompClient]);

  return { stompClient, connected, connect };
};
