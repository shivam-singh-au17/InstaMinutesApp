
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

  let tr = document.createElement('tr');

  users.forEach(function (user) {
    let div = document.createElement('div');
    div.id = "oneUser"
    div.innerHTML = `<i class="fa fa-user" aria-hidden="true"></i> <span> ${user}</span> <i class="fa fa-circle" aria-hidden="true"></i>`;
    tr.appendChild(div);
  });

  let usersList = document.getElementById('users');
  usersList.innerHTML = "";
  usersList.appendChild(tr);

})

socket.on("newMessage", (message) => {

  const getOnlyTime = moment(message.createdAt).format('LT');
  let div1 = document.createElement("div");
  div1.id ="one-msg-box"
  let span1 = document.createElement("span");
  span1.innerHTML = `${message.from}`
  let div2 = document.createElement("div");
  div2.innerHTML = `${message.text}`
  let span2 = document.createElement("span");
  span2.innerHTML = `${getOnlyTime}`
  div1.append(span1, div2, span2);
  document.getElementById("mainMessageCntainer").appendChild(div1);
  autoScrollingFunction()

})


socket.on('newLocationMessage', function (message) {

  const getOnlyTime = moment(message.createdAt).format('LT');
  let div = document.createElement("div");
  div.id = "one-location-box";

  let span1 = document.createElement("span");
  span1.innerHTML = `${message.from}`

  let div2 = document.createElement("div");

  let a = document.createElement("a");
  a.setAttribute("target", "_blank");
  a.setAttribute("href", message.url);
  a.innerText = `My Location`;

  let span2 = document.createElement("span");
  span2.innerHTML = `${getOnlyTime}`

  div2.appendChild(a)
  div.append(span1, div2, span2);
  document.getElementById("mainMessageCntainer").appendChild(div);
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


