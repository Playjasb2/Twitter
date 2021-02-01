import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import userRoute from "./routes/User";
import ChatServer from "./servers/ChatServer";

import * as env from "env-var";

const PORT = env.get("PORT").required().asPortNumber();
const DB_CONNECT = env.get("DB_CONNECT").required().asString();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Route Middlewares
app.use("/api/user", userRoute);

// Connect to database
const db_connect = async () => {
  try {
    await mongoose.connect(DB_CONNECT, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });

    const server = app.listen(PORT, () =>
      console.log("Server is up and running!")
    );

    // Setup chat service
    const chatServer = new ChatServer(server);
  } catch (error) {
    console.log("Can't connect to database!");
    process.exit();
  }
};

mongoose.connection.on("connected", () => {
  console.log("Connected to database!");
});

mongoose.connection.on("error", (error) => {
  console.log(error);
});

mongoose.connection.on("disconnected", () => {
  console.log("Disconnected! Attempting to reconnect...");
  db_connect();
});

db_connect();
