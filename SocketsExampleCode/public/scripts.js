const socket = io('http://localhost:3000') // Socket.io front-end code is passed through to this file from the HTML which grabs the necessary socket.io files from the server

socket.on('welcome', (data) => { // The front-end connection of the socket is listening for a 'welcome' event before responding with a 'thanks' event
    console.log(data)
    socket.emit('thanks', "Thanks!")
})

/* Since browsers cannot execute Node.js code, we cannot simply 'require' Socket.io to connect to the websocket on the front end.
Instead, the html script element "/socket.io/socket.io.min.js" is grabbing the front-end friendly version of Socket.io for script.js
to use. All we have to then do is pass in the port that the websocket is on for it to connect to the server-side, and boom we have a connection */