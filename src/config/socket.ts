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
   console.log("====================================");
   console.log("socket connect server");
   console.log("====================================");

   socket.on("user", (data: string) => {
     ioInstance?.emit("user", data);
   });

    socket.on("disconnect", () => {
      console.log("A user disconnected.");
    });
  });
};

export const getSocketIO = () => {
  return ioInstance;
};
