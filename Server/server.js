require("dotenv").config();
const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {messageGeneratingFunction} = require('./utils/message');
const {locationGeneratingFunction} = require('./utils/location');
const {checkValidString} = require('./utils/isValidString');
const {Users} = require('./utils/singleUsers');

const publicPath = path.join(__dirname, '/../public');
const port = process.env.PORT
let app = express();
let server = http.createServer(app);
let io = socketIO(server);
let users = new Users();

app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log("A new user just connected");

  socket.on('join', (params, callback) => {
    if(!checkValidString(params.name) || !checkValidString(params.room)){
      return callback('Name and room are required');
    }

    socket.join(params.room);
    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, params.room);

    io.to(params.room).emit('updateUsersList', users.getUserList(params.room));
    socket.emit('newMessage', messageGeneratingFunction('Admin', `Welocome to ${params.room}!`));

    socket.broadcast.to(params.room).emit('newMessage', messageGeneratingFunction('Admin', "New User Joined!"));

    callback();
  })

  socket.on('createMessage', (message, callback) => {
    let user = users.getUser(socket.id);

    if(user && checkValidString(message.text)){
        io.to(user.room).emit('newMessage', messageGeneratingFunction(user.name, message.text));
    }
    callback('This is the server:');
  })

  socket.on('createLocationMessage', (coords) => {
    let user = users.getUser(socket.id);

    if(user){
      io.to(user.room).emit('newLocationMessage', locationGeneratingFunction(user.name, coords.lat, coords.lng))
    }
  })

  socket.on('disconnect', () => {
    let user = users.removeUser(socket.id);

    if(user){
      io.to(user.room).emit('updateUsersList', users.getUserList(user.room));
      io.to(user.room).emit('newMessage', messageGeneratingFunction('Admin', `${user.name} has left ${user.room} chat room.`))
    }
  });
});

server.listen(port, ()=>{
  console.log(`Server is up on port ${port}`);
})
