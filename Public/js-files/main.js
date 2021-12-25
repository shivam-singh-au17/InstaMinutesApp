
let socket = io();

socket.on("connect", () => {
    console.log("A connection to the server has been established");
})

socket.on("disconnect", () => {
    console.log("The connection has been lost by the server");
})

socket.on("newMessage", (message) => {
    console.log("New Message", message);
})