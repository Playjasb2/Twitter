import express from "express";
import User from "../models/User";
import bcrypt from "bcryptjs";

import { registerValidation } from "../validation";

const router = express.Router();

router.post("/register", async (req, res) => {
  const userData = {
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
  };

  try {
    // Validate the data
    const { error, value } = registerValidation(userData);

    if (error) {
      throw error;
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(userData.password, salt);

    // Save the user to the database
    const user = new User({ ...userData, password: hashPassword });
    await user.save();
    res.send("User saved successfully!");
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.post("/login", async (req, res) => {});

export default router;
