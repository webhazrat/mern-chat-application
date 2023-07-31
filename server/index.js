import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import bcrypt from "bcrypt";
import fs from "fs";
import { fileURLToPath } from "url";
import path from "path";
import { WebSocketServer } from "ws";

import UserModel from "./models/User.js";
import MessageModel from "./models/Message.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use("/uploads", express.static(__dirname + "/uploads"));
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
  })
);

const jwtSecret = process.env.JWT_SECRET;
const bcryptSalt = bcrypt.genSaltSync(10);

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB connected!"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.json("Application server in working");
});

app.get("/messages/:userId", async (req, res) => {
  const { userId } = req.params;
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, jwtSecret, {}, async (err, user) => {
      if (err) throw err;
      const { userId: ourUserId } = user;
      const messages = await MessageModel.find({
        sender: { $in: [userId, ourUserId] },
        recipient: { $in: [userId, ourUserId] },
      }).sort({ createdAt: 1 });
      res.json(messages);
    });
  }
});

app.get("/people", async (req, res) => {
  try {
    const users = await UserModel.find({}, { _id: 1, username: 1 });
    res.json(
      users.map((user) => {
        return { userId: user._id, username: user.username };
      })
    );
  } catch (err) {
    res.status(422).json({ error: { unknown: "Something wrong!" } });
  }
});

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const foundUser = await UserModel.findOne({ username });
    if (foundUser) {
      res.status(400).json({ error: { username: "Username already exist!" } });
    } else {
      const hashPassword = bcrypt.hashSync(password, bcryptSalt);
      const user = await UserModel.create({
        username,
        password: hashPassword,
      });
      jwt.sign({ userId: user._id, username }, jwtSecret, {}, (err, token) => {
        if (err) throw err;
        res
          .cookie("token", token, { sameSite: "none", secure: true })
          .status(201)
          .json({
            userId: user._id,
          });
      });
    }
  } catch (err) {
    res.status(422).json({ error: { unknown: "Something wrong!" } });
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const foundUser = await UserModel.findOne({ username });
    if (foundUser) {
      const passOk = bcrypt.compareSync(password, foundUser.password);
      if (passOk) {
        jwt.sign(
          { userId: foundUser._id, username: foundUser.username },
          jwtSecret,
          {},
          (err, token) => {
            if (err) throw err;
            res
              .cookie("token", token, { sameSite: "none", secure: true })
              .status(201)
              .json({
                userId: foundUser._id,
              });
          }
        );
      } else {
        res
          .status(400)
          .json({ error: { both: "Username and password doesn't match" } });
      }
    } else {
      res
        .status(400)
        .json({ error: { both: "Username and password doesn't match" } });
    }
  } catch (err) {
    res.status(422).json({ error: { unknown: "Something wrong!" } });
  }
});

app.get("/profile", (req, res) => {
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, jwtSecret, {}, (err, user) => {
      if (err) throw err;
      res.status(200).json(user);
    });
  } else {
    res.status(404).json("Not found token");
  }
});

app.post("/logout", (req, res) => {
  res
    .cookie("token", "", { sameSite: "none", secure: true })
    .json("Token removed");
});

const server = app.listen(5000, () =>
  console.log("Application server in running on port 5000")
);

const wss = new WebSocketServer({ server });

wss.on("connection", (connection, req) => {
  console.log("WebSocketServer Connected!");

  const notifyAboutOnlinePeople = () => {
    [...wss.clients].forEach((client) => {
      client.send(
        JSON.stringify({
          online: [...wss.clients].map((c) => ({
            userId: c.userId,
            username: c.username,
          })),
        })
      );
    });
  };

  connection.isAlive = true;
  connection.timer = setInterval(() => {
    connection.ping();
    connection.deathTimer = setTimeout(() => {
      connection.isAlive = false;
      clearInterval(connection.timer);
      connection.terminate();
      notifyAboutOnlinePeople();
    }, 1000);
  }, 3000);

  connection.on("pong", () => {
    clearTimeout(connection.deathTimer);
  });

  // read username and id from the cookie for this connection
  const cookies = req.headers.cookie;
  if (cookies) {
    const tokenString = cookies
      .split(";")
      .find((str) => str.startsWith("token="));
    if (tokenString) {
      const token = cookies.split("=")[1];
      if (token) {
        jwt.verify(token, jwtSecret, {}, (err, user) => {
          if (err) throw err;
          const { userId, username } = user;
          connection.userId = userId;
          connection.username = username;
        });
      }
    }
  }

  connection.on("message", async (message) => {
    const messageData = JSON.parse(message.toString());
    const { recipient, text, file } = messageData;
    let filename = null;
    if (file) {
      const parts = file.name.split(".");
      const ext = parts[parts.length - 1];
      filename = Date.now() + "." + ext;
      const path = __dirname + "/uploads/" + filename;
      const base64Image = file.data.split(";base64,").pop();
      fs.writeFile(path, base64Image, { encoding: "base64" }, () => {
        console.log("File saved " + path);
      });
    }
    if (recipient && (text || file)) {
      const messageDoc = await MessageModel.create({
        sender: connection.userId,
        recipient: recipient,
        text,
        file: file ? filename : null,
      });

      [...wss.clients]
        .filter((c) => c.userId === recipient)
        .forEach((c) =>
          c.send(
            JSON.stringify({
              text,
              sender: connection.userId,
              recipient,
              file: file ? filename : null,
              _id: messageDoc._id,
            })
          )
        );
    }
  });

  // notify everyone about online people (when someone connects)
  notifyAboutOnlinePeople();
});
