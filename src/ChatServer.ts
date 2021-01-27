import socketIO from "socket.io";
import { Server } from "http";
import jwt from "jsonwebtoken";

import User from "./models/User";
import { saveMessage, getAllMessages } from "./controllers/Chat";

interface myHeader {
  token: undefined | string;
}

interface Connections {
  [id: string]: ExtendedSocket;
}

interface decodedToken {
  _id: string;
  iat: number;
}

export interface ExtendedSocket extends socketIO.Socket {
  username: string;
}

export interface MessageType {
  from: string;
  to: string;
  message: string;
}

export interface AllMessagesOrder {
  from: string;
  to: string;
}

class ChatServer {
  private io: socketIO.Server;
  private connections: Connections = {};

  constructor(server: Server) {
    this.io = new socketIO.Server(server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });
    this.listen();
  }

  private listen(): void {
    console.log("Chat Service is up!");
    this.io
      .use((socket, next) => {
        // Check if the header has a token.
        const handshake = socket.handshake.headers as myHeader;

        if (handshake && handshake.token !== undefined) {
          const token = handshake.token;
          jwt.verify(token, process.env.TOKEN_SECRET!, async (err, decoded) => {
            // If the token is invalid
            if (err) return next(new Error("Authentication error"));

            // Check that the user actually exist
            const { _id } = decoded as decodedToken;

            try {
              const user = await User.findOne({ _id: _id });

              if (!user) {
                return next(new Error("Authentication error"));
              }

              const mySocket = socket as ExtendedSocket;
              mySocket.username = user.username;
              this.connections[user.username] = mySocket;

              next();
            } catch (error) {
              return next(new Error("Can't query the database"));
            }
          });
        } else {
          next(new Error("Authentication error"));
        }
      })
      .on("connect", (socket: ExtendedSocket) => {
        console.log("Client connected!");

        socket.on("chat message", async (msg: MessageType) => {
          try {
            await saveMessage(msg);
            if (msg.to in this.connections) {
              this.connections[msg.to].emit("chat message", msg);
            }
          } catch (error) {
            try {
              socket.emit("error", error);
            } catch (error) {}
          }
        });

        socket.on("get all messages", async (order: AllMessagesOrder) => {
          try {
            const messages = await getAllMessages(order);
            socket.emit("receive all messages", messages);
          } catch (error) {
            try {
              socket.emit("error", error);
            } catch (error) {}
          }
        });

        socket.on("disconnect", () => {
          console.log("Client disconnected!");
          delete this.connections[socket.username];
        });
      });
  }
}

export default ChatServer;
