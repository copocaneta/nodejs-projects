// const express = require("express");
import * as express from "express";
import { Request, Response } from "express";

// import our mondodb URL with keys
import config from "./config/keys";

// import express from 'express'
const bodyParser = require("body-parser");

const app = express();

// Setting up our HTTP server so we can integrate Express with Socket.io
const http = require("http").Server(app);

const io = require("socket.io")(http);

const mongoose = require("mongoose");

app.use(express.static(__dirname));
app.use(bodyParser.json());
// app.use(bodyParser({ extended: false }));

// let mongoose know that the Promise library we want to use is the default for ES6:

mongoose.Promise = Promise;

const Message = mongoose.model("Message", {
  name: String,
  message: String,
});

// const messages = [
//   { name: "Tim", message: "Hi" },
//   { name: "Jane", message: "Hello" },
// ];

app.get("/messages", (req: Request, res: Response): void => {
  Message.find({}, (err: string, messages: string) => {
    res.send(messages);
  });
  // res.send(messages);
});

app.get("/messages/:user", (req: Request, res: Response) => {
  const user = req.params.user;
  Message.find({ name: user }, (err: string, messages: string) => {
    res.send(messages);
  });
  // res.send(messages);
});

app.post("/messages", async (req, res) => {
  try {
    // console.log(req.body);

    const message = new Message(req.body);

    const savedMessage = await message.save();

    // if (err) {
    //   sendStatus(500);
    // }
    console.log("saved");
    const censored = await Message.findOne({ message: "badword" });

    if (censored) {
      console.log("censored words found", censored);
      await Message.deleteOne({ _id: censored.id });
    } else {
      // messages.push(req.body);
      io.emit("message", req.body);
    }

    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(500);
    return console.error(error);
  } finally {
    console.log("message post called");
  }

  // .catch((err) => {
  //   res.sendStatus(500);
  //   return console.error(err);
  // });
  // messages.push(req.body);
  // io.emit("message", req.body);
  // res.sendStatus(200);
});

io.on("connection", (socket: any) => {
  console.log("a user connected");
});

// our mongoose ocnnection

mongoose.connect(config.dbUrl, (err: string) => {
  console.log("mongo db connection", err);
});

// below we used to use const server = app.listen and after adding socket.io I had to do http.listen

const server = http.listen(3000, () => {
  console.log(`Server is listening on port ${server.address().port}`);
});
