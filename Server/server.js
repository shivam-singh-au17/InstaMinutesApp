require("dotenv").config();

const path = require("path");
const http = require("http");

const express = require("express");
const socketIO = require('socket.io');

const { messageGeneratingFunction } = require('./utils/message');
const { locationGeneratingFunction } = require('./utils/location');
const { checkValidString } = require('./utils/isValidString');
const { Users } = require('./utils/singleUsers');

const publicPath = path.join(__dirname, './../public');
const port = process.env.PORT

let app = express();
let server = http.createServer(app);
let ioServer = socketIO(server);
let users = new Users();

app.use(express.static(publicPath));



// Connection established by socket.io
ioServer.on("connection", (socket) => {

    console.log("ChatApp joined by a user");


    socket.on('join', (params, callback) => {

        if (!checkValidString(params.name) || !checkValidString(params.room)) {
            return callback('Name and room are required');
        }

        // console.log(socket.id);
        socket.join(params.room);
        users.removeUser(socket.id);
        users.addUser(socket.id, params.name, params.room);

        ioServer.to(params.room).emit('updateUsersList', users.getUserList(params.room));

        // To send welcome message to the user who has joined the ChatApp
        socket.emit('newMessage', messageGeneratingFunction('ChatApp', `Welocome to ${params.room}!`));

        // A new user has joined the chat app to send notifications to everyone in the group
        socket.broadcast.to(params.room).emit('newMessage', messageGeneratingFunction('ChatApp', "A New User Joined!"));

        callback();
    })



    //  Listening to the event to generate the message
    socket.on('createMessage', (message, callback) => {
        let user = users.getUser(socket.id);

        if (user && checkValidString(message.text)) {
            ioServer.to(user.room).emit('newMessage', messageGeneratingFunction(user.name, message.text));
        }
        callback('This is the server:');
    })


 
    socket.on('createLocationMessage', (coords) => {
        let user = users.getUser(socket.id);

        if (user) {
            ioServer.to(user.room).emit('newLocationMessage', locationGeneratingFunction(user.name, coords.lat, coords.lng))
        }
    })


    // When the user leaves the ChatApp
    socket.on('disconnect', () => {

        console.log("ChatApp abandoned by a user");

        let user = users.removeUser(socket.id);

        if (user) {
            ioServer.to(user.room).emit('updateUsersList', users.getUserList(user.room));
            ioServer.to(user.room).emit('newMessage', messageGeneratingFunction('Admin', `${user.name} has left ${user.room} chat room.`))
        }
    });


})


server.listen(port, () => {
    console.log("Express server running on PORT :=>", port);
});

