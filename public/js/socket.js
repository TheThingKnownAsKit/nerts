const socket = io('http://localhost:3000') // Socket.io front-end code is passed through to this file from the HTML which grabs the necessary socket.io files from the server

socket.on('welcome', (data) => { // The front-end connection of the socket is listening for a 'welcome' event before responding with a 'thanks' event
    console.log(data)
    socket.emit('thanks', "Thanks!")
})