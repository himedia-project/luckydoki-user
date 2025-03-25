import { useState, useEffect, useCallback } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { API_URL } from "../config/apiConfig";

export default function useWebSocket(userEmail, accessToken) {
  const [stompClient, setStompClient] = useState(null);
  const [connected, setConnected] = useState(false);

  const connect = useCallback(
    (e) => {
      if (e) e.preventDefault();

      if (userEmail && !connected) {
        const client = new Client({
          webSocketFactory: () => new SockJS(`${API_URL}/wss-stomp`),
          connectHeaders: {
            "X-Authorization": `Bearer ${accessToken}`,
          },
          debug: (str) => {
            console.log("STOMP Debug:", str);
          },
          reconnectDelay: 5000,
          heartbeatIncoming: 4000,
          heartbeatOutgoing: 4000,
          onConnect: () => {
            console.log("socket 연결 완료");
            setConnected(true);
            setStompClient(client);
          },
          onWebSocketError: (error) => {
            console.error("WebSocket 에러:", error);
            if (!userEmail) {
              console.log("로그인이 필요합니다. 재연결을 중단합니다.");
              client.deactivate();
            }
          },
          onDisconnect: () => {
            console.log("Disconnected from STOMP");
            setConnected(false);
            setStompClient(null);

            if (userEmail) {
              console.log("재연결 시도...");
            } else {
              console.log("로그인이 필요하여 재연결을 중단합니다.");
            }
          },
          onStompError: (frame) => {
            console.error("Broker reported error:", frame.headers["message"]);
            console.error("Additional details:", frame.body);
          },
        });

        try {
          console.log("연결 시도 중...");
          client.activate();
        } catch (error) {
          console.error("연결 에러:", error);
          setConnected(false);
          setStompClient(null);
        }
      }
    },
    [userEmail, connected, accessToken]
  );

  const disconnect = useCallback(() => {
    if (stompClient && typeof stompClient.deactivate === "function") {
      try {
        stompClient.deactivate();
        setStompClient(null);
        setConnected(false);
      } catch (error) {
        console.error("연결종료 에러 발생", error);
      }
    }
  }, [stompClient]);

  const subscribe = useCallback(
    (roomId, onMessageReceived) => {
      if (!stompClient || !roomId) return null;

      const subscription = stompClient.subscribe(
        `/topic/chat/message/${roomId}`,
        (message) => {
          const receivedMessage = JSON.parse(message.body);
          onMessageReceived(receivedMessage);
        }
      );

      return subscription;
    },
    [stompClient]
  );

  const sendMessage = useCallback(
    (destination, message, headers = {}) => {
      if (!stompClient?.connected) {
        console.error("STOMP 연결이 끊어졌습니다.");
        return false;
      }

      try {
        stompClient.publish({
          destination,
          headers: {
            "X-Authorization": `Bearer ${accessToken}`,
            ...headers,
          },
          body: JSON.stringify(message),
        });
        return true;
      } catch (error) {
        console.error("메시지 전송 중 에러 발생:", error);
        return false;
      }
    },
    [stompClient, accessToken]
  );

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    connected,
    connect,
    disconnect,
    subscribe,
    sendMessage,
  };
}
