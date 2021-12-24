require("dotenv").config();
const path = require("path");
const http = require("http");
const express = require("express");
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '/../public');
const port = process.env.PORT
let app = express();
let server = http.createServer(app);
let ioServer = socketIO(server);

app.use(express.static(publicPath));

ioServer.on("connection", (socket) => {

    console.log("A new user just connected");

    socket.on("disconnect", () => {
        console.log("User was disconnected");
    })
})



server.listen(port, () => {
    console.log("Express server running on PORT :=>", port);
});

