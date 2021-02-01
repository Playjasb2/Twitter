import { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { registerValidation, loginValidation } from "../util/validation";

import * as env from "env-var";

const TOKEN_SECRET = env.get("TOKEN_SECRET").required().asString();

export const register = async (req: Request, res: Response) => {
  const userData = {
    username: req.body.username,
    password: req.body.password,
  };

  try {
    // Validate the data
    const { error, value } = registerValidation(userData);

    if (error) {
      throw error;
    }

    // Check if username is already taken
    const usernameExist = await User.findOne({ username: req.body.username });

    if (usernameExist) {
      return res.status(400).send("Username is already taken");
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(userData.password, salt);

    // Save the user to the database
    const user = new User({
      username: userData.username,
      password: hashPassword,
    });

    await user.save();
    res.send("User saved successfully!");
    return res;
  } catch (error) {
    res.status(400).send(error.message);
    return res;
  }
};

export const login = async (req: Request, res: Response) => {
  const userData = {
    username: req.body.username,
    password: req.body.password,
  };

  try {
    // Validate the data
    const { error, value } = loginValidation(userData);

    if (error) {
      throw error;
    }

    // Check if user exist
    const user = await User.findOne({ username: req.body.username });

    if (!user) {
      return res.status(400).send("Incorrect username or password");
    }

    const authenticated = await bcrypt.compare(
      userData.password,
      user.password
    );

    if (!authenticated) {
      return res.status(400).send("Incorrect username or password");
    }

    const token = jwt.sign({ _id: user._id }, TOKEN_SECRET);

    res.header("auth-token", token);
    res.send("Logged in!");

    return res;
  } catch (error) {
    res.status(400).send("Incorrect username or password");

    return res;
  }
};
