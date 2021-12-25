
let socket = io();

socket.on("connect", () => {
    console.log("A connection to the server has been established");
})

socket.on("disconnect", () => {
    console.log("The connection has been lost by the server");
})

socket.on("newMessage", (message) => {
    console.log("New Message", message);

    const getOnlyTime = moment(message.createdAt).format('LT');
    let li = document.createElement("li");
    li.innerText = `${message.from} ${getOnlyTime} : ${message.text}`
    document.querySelector("body").appendChild(li);
})


socket.on('newLocationMessage', function (message) {
    console.log("newLocationMessage", message);

    const getOnlyTime = moment(message.createdAt).format('LT');
    let li = document.createElement("li");
    let a = document.createElement("a");
    li.innerText = `${message.from} ${getOnlyTime}:`
    a.setAttribute("target", "_blank");
    a.setAttribute("href", message.url);
    a.innerText = `My Current Location`;
    li.appendChild(a);
    document.querySelector("body").appendChild(li);
});



document.getElementById("sendMessageBtn").addEventListener("click", (e) => {
    e.preventDefault();

    socket.emit("createMessage", {
        from: "User",
        text: document.getElementById("InputChatData").value
    }, function () {

    })
})



document.getElementById("sendLocationBtn").addEventListener("click", () => {
    if (!navigator.geolocation) {
        return alert("Geolocation is not supported by your browser.")
    }

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit("createLocationMessage", {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        })
    }, function () {
        alert("Unable to fetch location.")
    })
});