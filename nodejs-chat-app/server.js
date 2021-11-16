"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
// const express = require("express");
var express = require("express");
// import our mondodb URL with keys
var keys_1 = require("./config/keys");
// import express from 'express'
var bodyParser = require("body-parser");
var app = express();
// Setting up our HTTP server so we can integrate Express with Socket.io
var http = require("http").Server(app);
var io = require("socket.io")(http);
var mongoose = require("mongoose");
app.use(express.static(__dirname));
app.use(bodyParser.json());
// app.use(bodyParser({ extended: false }));
// let mongoose know that the Promise library we want to use is the default for ES6:
mongoose.Promise = Promise;
var Message = mongoose.model("Message", {
    name: String,
    message: String
});
// const messages = [
//   { name: "Tim", message: "Hi" },
//   { name: "Jane", message: "Hello" },
// ];
app.get("/messages", function (req, res) {
    Message.find({}, function (err, messages) {
        res.send(messages);
    });
    // res.send(messages);
});
app.get("/messages/:user", function (req, res) {
    var user = req.params.user;
    Message.find({ name: user }, function (err, messages) {
        res.send(messages);
    });
    // res.send(messages);
});
app.post("/messages", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var message, savedMessage, censored, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, 7, 8]);
                message = new Message(req.body);
                return [4 /*yield*/, message.save()];
            case 1:
                savedMessage = _a.sent();
                // if (err) {
                //   sendStatus(500);
                // }
                console.log("saved");
                return [4 /*yield*/, Message.findOne({ message: "badword" })];
            case 2:
                censored = _a.sent();
                if (!censored) return [3 /*break*/, 4];
                console.log("censored words found", censored);
                return [4 /*yield*/, Message.deleteOne({ _id: censored.id })];
            case 3:
                _a.sent();
                return [3 /*break*/, 5];
            case 4:
                // messages.push(req.body);
                io.emit("message", req.body);
                _a.label = 5;
            case 5:
                res.sendStatus(200);
                return [3 /*break*/, 8];
            case 6:
                error_1 = _a.sent();
                res.sendStatus(500);
                return [2 /*return*/, console.error(error_1)];
            case 7:
                console.log("message post called");
                return [7 /*endfinally*/];
            case 8: return [2 /*return*/];
        }
    });
}); });
io.on("connection", function (socket) {
    console.log("a user connected");
});
// our mongoose ocnnection
mongoose.connect(keys_1["default"].dbUrl, function (err) {
    console.log("mongo db connection", err);
});
// below we used to use const server = app.listen and after adding socket.io I had to do http.listen
var server = http.listen(3000, function () {
    console.log("Server is listening on port " + server.address().port);
});
