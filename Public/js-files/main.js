
let socket = io();

socket.on("connect", () => {
    console.log("A connection to the server has been established");
})

socket.on("disconnect", () => {
    console.log("The connection has been lost by the server");
})

socket.on("newMessage", (message) => {
    console.log("New Message", message);
    let li = document.createElement("li");
    li.innerHTML = `${message.from} : ${message.text}`
    document.querySelector("body").appendChild(li);
})


// socket.emit("createMessage", {
//     from: "Shivam Singh",
//     text: "Hey"
// }, function (message) {
//     console.log("Got it.", message);
// });



document.getElementById('submit-btn').addEventListener('click', function (e) {
    e.preventDefault();

    socket.emit("createMessage", {
        from: "User",
        text: document.querySelector('input[name="message"]').value
    }, function () {
        
    })
})