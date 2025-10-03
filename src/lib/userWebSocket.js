// useWebSocket.js
import { useEffect, useRef } from "react";
import { Client } from "@stomp/stompjs";

export const useWebSocket = (roomId, onMessage) => {
  const clientRef = useRef();

  useEffect(() => {
    const client = new Client({
      brokerURL: "ws://localhost:8080/ws",
      onConnect: () => {
        client.subscribe(`/topic/room/${roomId}`, (message) => {
          const payload = JSON.parse(message.body);
          onMessage(payload);
        });
      },
    });
    client.activate();
    clientRef.current = client;
    return () => client.deactivate();
  }, [roomId]);
};
