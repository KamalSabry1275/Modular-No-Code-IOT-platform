import { io } from "socket.io-client";

const PORT = "5500";
const IP = "192.168.43.183";

const URL = `http://${IP}:${PORT}`;

export const socket = io(URL, {
  autoConnect: false,
});
