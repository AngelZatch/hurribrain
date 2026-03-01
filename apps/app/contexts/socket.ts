import { io } from "socket.io-client";

export const socket = io("http://localhost:8080", {
  transports: ["websocket"],
  reconnection: true,
  reconnectionDelay: 400,
  reconnectionAttempts: 10,
  autoConnect: false,
});