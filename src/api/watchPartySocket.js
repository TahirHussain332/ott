import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

let stompClient = null;

export const connectWatchPartySocket = (roomCode, onPlaybackEventReceived, onChatMessageReceived) => {
  stompClient = new Client({
    webSocketFactory: () => new SockJS("http://ec2-13-234-67-86.ap-south-1.compute.amazonaws.com:9090/ws"),
    reconnectDelay: 5000,
    debug: (msg) => console.log("STOMP:", msg),

    onConnect: () => {
      console.log("✅ WebSocket connected");

      // Subscribe to playback events
      stompClient.subscribe(`/topic/room/${roomCode}`, (message) => {
        const event = JSON.parse(message.body);
        if (onPlaybackEventReceived) {
          onPlaybackEventReceived(event);
        }
      });

      // Subscribe to chat messages
      stompClient.subscribe(`/topic/room/${roomCode}/chat`, (message) => {
        const chatMessage = JSON.parse(message.body);
        if (onChatMessageReceived) {
          onChatMessageReceived(chatMessage);
        }
      });
    },

    onStompError: (frame) => {
      console.error("❌ STOMP error", frame);
    },
  });

  stompClient.activate();
};

export const disconnectWatchPartySocket = () => {
  if (stompClient) {
    stompClient.deactivate();
    stompClient = null;
    console.log("🔌 WebSocket disconnected");
  }
};

export const sendPlaybackEvent = (event) => {
  if (stompClient && stompClient.connected) {
    stompClient.publish({
      destination: "/app/playback",
      body: JSON.stringify(event),
    });
  }
};

export const sendChatMessage = (chatMessage) => {
  if (stompClient && stompClient.connected) {
    stompClient.publish({
      destination: "/app/chat",
      body: JSON.stringify(chatMessage),
    });
  }
};

