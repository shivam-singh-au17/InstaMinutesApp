require("dotenv").config();

const path = require("path");
const http = require("http");

const express = require("express");
const socketIO = require('socket.io');

const { messageGeneratingFunction } = require('./utils/message');
const { locationGeneratingFunction } = require('./utils/location');

const publicPath = path.join(__dirname, './../public');
const port = process.env.PORT

let app = express();
let server = http.createServer(app);
let ioServer = socketIO(server);

app.use(express.static(publicPath));



// Connection established by socket.io
ioServer.on("connection", (socket) => {

    console.log("ChatApp joined by a user");


    // To send welcome message to the user who has joined the ChatApp
    socket.emit('newMessage', messageGeneratingFunction('ChatApp', `Welcome to the chat app!`));


    
    // A new user has joined the chat app to send notifications to everyone in the group
    socket.broadcast.emit('newMessage', messageGeneratingFunction('ChatApp', "A New User Joined!"));



    //  Listening to the event to generate the message
    socket.on("createMessage", (message, callback) => {
        console.log("createMessage", message);
        ioServer.emit("newMessage", messageGeneratingFunction(message.from, message.text))
        callback('This is the server:');
    })


    socket.on('createLocationMessage', (coords) => {
        
            ioServer.emit('newLocationMessage', locationGeneratingFunction("ChatApp", coords.lat, coords.lng))
        
    })


    // When the user leaves the ChatApp
    socket.on("disconnect", () => {
        console.log("ChatApp abandoned by a user");
    })


})



server.listen(port, () => {
    console.log("Express server running on PORT :=>", port);
});

