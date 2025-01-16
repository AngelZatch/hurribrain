import { io } from "socket.io-client";

export const socket = io("http://localhost:8080/games/play", {
  transports: ["websocket"],
  reconnection: true,
  reconnectionDelay: 500,
  reconnectionAttempts: 10, 
})