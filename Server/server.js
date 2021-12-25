require("dotenv").config();

const path = require("path");
const http = require("http");

const express = require("express");
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, './../public');
const port = process.env.PORT

let app = express();
let server = http.createServer(app);
let ioServer = socketIO(server);

app.use(express.static(publicPath));



// Connection established by socket.io
ioServer.on("connection", (socket) => {

    console.log("chatApp joined by a user");


    // To send welcome message to the user who has joined the ChatApp
    socket.emit('newMessage', {
        from: "chatApp",
        text: "Welcome to the chat app!",
        createdTime: new Date().getTime()
    });


    // A new user has joined the chat app to send notifications to everyone in the group
    socket.broadcast.emit('newMessage', {
        from: "chatApp",
        text: "A New User Joined!",
        createdTime: new Date().getTime()
    });


    //  Listening to the event to generate the message
    socket.on("createMessage", (message) => {
        console.log("createMessage", message);
        ioServer.emit("", {
            from: message.from,
            text: message.text,
            createdTime: new Date().getTime()
        })
    })


    // When the user leaves the ChatApp
    socket.on("disconnect", () => {
        console.log("chatApp abandoned by a user");
    })


})



server.listen(port, () => {
    console.log("Express server running on PORT :=>", port);
});

