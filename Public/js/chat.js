
let socket = io();

function autoScrollingFunction() {
  let messages = document.querySelector('#mainMessageCntainer').lastElementChild;
  messages.scrollIntoView();
}

socket.on("connect", () => {

  console.log("A connection to the server has been established");

  let searchQuery = window.location.search.substring(1);
  let params = JSON.parse('{"' + decodeURI(searchQuery).replace(/&/g, '","').replace(/\+/g, ' ').replace(/=/g, '":"') + '"}');

  socket.emit('join', params, function (err) {
    if (err) {
      alert(err);
      window.location.href = '/';
    } else {
      console.log('No Error');
    }
  })
})

socket.on("disconnect", () => {
  console.log("The connection has been lost by the server");
})


socket.on('updateUsersList', function (users) {
  let ol = document.createElement('ol');

  users.forEach(function (user) {
    let li = document.createElement('li');
    li.innerHTML = user;
    ol.appendChild(li);
  });

  let usersList = document.querySelector('#users');
  usersList.innerHTML = "";
  usersList.appendChild(ol);
})

socket.on("newMessage", (message) => {
  console.log("New Message", message);

  const getOnlyTime = moment(message.createdAt).format('LT');
  let li = document.createElement("li");
  li.innerText = `${message.from} ${getOnlyTime} : ${message.text}`
  document.getElementById("mainMessageCntainer").appendChild(li);
  autoScrollingFunction()
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
  document.getElementById("mainMessageCntainer").appendChild(li);
  autoScrollingFunction()
});



document.getElementById("sendMessageBtn").addEventListener("click", (e) => {
  e.preventDefault();

  socket.emit("createMessage", {
    from: "User",
    text: document.getElementById("InputChatData").value
  }, function () {
    document.getElementById("InputChatData").value = '';
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