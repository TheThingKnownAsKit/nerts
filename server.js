const express = require('express') // Require() is the Node version of using "import abc from xyz". Here we're importing the web framework express to make HTTP server creation and management easier

const app = express() // Running express() generates an express application (again, express just has functions that make server handling easier)

app.use(express.static('public')) // This tells our express/web app to serve the client (browser) static files in the public folder so we don't have to deal with file path nonsense
const expressServer = app.listen(3000) // This creates the actual express HTTP server on port 3000 (localhost:3000)

const socketio = require('socket.io') // Importing the Socket.io package
const io = socketio(expressServer, {/* optional config input */}) // Starts a websocket connection on the express server (both websocket info and HTTP requests now share port 3000)

io.on('connect', (socket) => { // With our websocket connection (io), on connection (port 3000), execute the function [(socket) => { function stuff }] (the socket variable is the connection created)
    console.log(socket.id, " has joined our server!") // Print the socket connection ID
    socket.emit('welcome', "Welcome to the server!") // "Emit" an event on the socket connection I've called welcome that passes the data "Welcome to the server!"

    socket.on('thanks', (data) => { // When this socket connection "hears" a 'thanks' event emitted from front-end, execute the function (where the data from the front-end emission is the parameter)
        console.log(data)
    })
})