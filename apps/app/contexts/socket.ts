import { io } from "socket.io-client";

export const socket = io(`${process.env.EXPO_PUBLIC_API_URL}`, {
  transports: ["websocket"],
  reconnection: true,
  reconnectionDelay: 400,
  reconnectionAttempts: 10,
  autoConnect: false,
});