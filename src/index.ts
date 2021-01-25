import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// Connect to database
(async () => {
  try {
    if (process.env.DB_CONNECT === undefined) {
      console.log("ERROR: DB_CONNECT is not defined in a .env file");
      process.exit();
    }
    await mongoose.connect(process.env.DB_CONNECT, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to database!");
  } catch (error) {
    console.log("Can't connect to database!");
    process.exit();
  }
})();

const app = express();

if (process.env.PORT === undefined) {
  console.log("ERROR: PORT is not defined in a .env file");
  process.exit();
}

app.listen(process.env.PORT, () => console.log("Server is up and running!"));
