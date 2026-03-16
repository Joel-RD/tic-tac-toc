import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.PROD 
    ? "" // En producción se conecta al mismo host que sirve el frontend
    : "http://localhost:3001";

export const socket = io(SOCKET_URL, {
    autoConnect: false,
});

export const connectSocket = () => {
    if (!socket.connected) {
        socket.connect();
    }
};

export const disconnectSocket = () => {
    if (socket.connected) {
        socket.disconnect();
    }
};
