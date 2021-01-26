import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import userRoute from "./routes/User";

dotenv.config();
const app = express();

// Connect to database
const db_connect = async () => {
  try {
    if (process.env.DB_CONNECT === undefined) {
      console.log("ERROR: DB_CONNECT is not defined in a .env file");
      process.exit();
    }
    await mongoose.connect(process.env.DB_CONNECT, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
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

// Middlewares
app.use(cors());
app.use(express.json());

// Route Middlewares
app.use("/api/user", userRoute);

// Check that JWT secret has been defined
if (process.env.TOKEN_SECRET === undefined) {
  console.log("ERROR: TOKEN_SECRET is not defined in a .env file");
  process.exit();
}

// Listen for requests
if (process.env.PORT === undefined) {
  console.log("ERROR: PORT is not defined in a .env file");
  process.exit();
}

app.listen(process.env.PORT, () => console.log("Server is up and running!"));
