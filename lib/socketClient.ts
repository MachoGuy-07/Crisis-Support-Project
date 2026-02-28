"use client";

import { io, type Socket } from "socket.io-client";

let socketInstance: Socket | null = null;

export function getSocketClient(): Socket {
  if (socketInstance) return socketInstance;

  const socketUrl =
    process.env.NEXT_PUBLIC_SOCKET_URL?.trim() || "http://localhost:5000";

  socketInstance = io(socketUrl, {
    transports: ["websocket", "polling"],
    withCredentials: false,
  });

  return socketInstance;
}

export function disconnectSocketClient() {
  if (!socketInstance) return;
  socketInstance.disconnect();
  socketInstance = null;
}
