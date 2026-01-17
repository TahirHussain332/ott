import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

let stompClient = null;

// CONNECT
export const connectSignalingSocket = (roomCode, onMessage) => {
  stompClient = new Client({
    webSocketFactory: () => new SockJS("http://ec2-13-234-67-86.ap-south-1.compute.amazonaws.com:9090/ws"),
    reconnectDelay: 5000,

    onConnect: () => {
      console.log("✅ Signaling WebSocket connected");

      stompClient.subscribe(
        `/topic/room/${roomCode}/signaling`,
        (message) => {
          const data = JSON.parse(message.body);
          onMessage(data);
        }
      );
    },

    onStompError: (frame) => {
      console.error("❌ STOMP error", frame);
    },
  });

  stompClient.activate();
};

// SEND MESSAGE
export const sendSignalingMessage = (message) => {
  if (!stompClient || !stompClient.connected) {
    console.warn("❌ Signaling socket not connected");
    return;
  }

  stompClient.publish({
    destination: "/app/signaling",
    body: JSON.stringify(message),
  });
};

// DISCONNECT  ✅ THIS IS THE METHOD YOU ASKED ABOUT
export const disconnectSignalingSocket = () => {
  if (stompClient) {
    stompClient.deactivate();
    stompClient = null;
    console.log("🔌 Signaling WebSocket disconnected");
  }
};
