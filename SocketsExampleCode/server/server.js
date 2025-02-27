
const express = require('express') // Require() is the Node version of using "import abc from xyz". Here we're importing the web framework express to make HTTP server creation and management easier

const app = express() // Running express() generates an express application (again, express just has functions that make server handling easier)

app.use(express.static('../public')) // This tells our express/web app to serve the client (browser) static files in the public folder so we don't have to deal with file path nonsense
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

/* If you're confused by the formatting of .on(string, function()), it's a quirk of Javascript that's similar to C# lambda functions.
In Javascript, you can pass functions as parameters (called callback functions), and these callback functions are usually simplified
to what are called arrow functions. These are nameless functions of the form: (param1, param2, etc.) => { code to execute }. This
makes it really easy to write callback functionality without having to define a bunch of junk functions. In theory, though, you could
still write some function welcomeClient(socket) { logic here } that has all the logic, then just pass welcomeClient(socket) in like 
io.on('connect', welcomeClient(socket)) statement to achieve the same thing. */

/* Socket.io is "event-driven" (as well as Node) which basically just means it will "emit" and "listen" for events to then execute
corresponding code. For instance, in this code, the server is "emitting" an event called 'welcome' on the websocket connection.
if the client code is "listening" for a 'welcome' event (io.on('welcome', ...)), it will execute corresponding code. In general,
.on() is listening for a specific event on the websocket connection, and .emit() is emitting a specific event on the connection */