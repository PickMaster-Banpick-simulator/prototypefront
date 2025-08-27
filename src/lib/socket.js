import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

let stompClient = null;

export function connectBanPickSocket(gameId, onMessage) {
  stompClient = new Client({
    webSocketFactory: () => new SockJS("http://localhost:8000/ws-stomp"),
    reconnectDelay: 5000,
  });

  stompClient.onConnect = () => {
    stompClient.subscribe(`/topic/banpick/progress/${gameId}`, (message) => {
      const body = JSON.parse(message.body);
      onMessage(body);
    });
  };

  stompClient.activate();
}

export function sendBanPick(gameId, payload) {
  if (stompClient) {
    stompClient.publish({
      destination: `/app/banpick/select/${gameId}`,
      body: JSON.stringify(payload),
    });
  }
}

export function disconnectSocket() {
  stompClient?.deactivate();
}


