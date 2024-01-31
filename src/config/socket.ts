import { method } from "@utils/prefix";
import { Server as SocketIOServer, Socket } from "socket.io";

let ioInstance: SocketIOServer | null = null;

export const initSocketIO = (server: any) => {
  ioInstance = new SocketIOServer(server, {
    cors: {
      origin: "*",
      methods: [method.get, method.post],
    },
  });

  ioInstance.on("connection", (socket: Socket) => {
    console.log("A user connected.", socket.id);

    socket.emit("welcome", "Welcome to the server!");

    socket.on("chat message", (message: string) => {
      console.log(`Received message: ${message}`);
      ioInstance?.emit("chat message", message);
    });

    socket.on("disconnect", () => {
      console.log("A user disconnected.");
    });
  });
};

export const getSocketIO = () => {
  return ioInstance;
};
