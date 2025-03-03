const express = require('express')

const app = express()

const expressServer = app.listen(3000)

const socketio = require('socket.io')
const io = socketio(expressServer, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
    }
})

io.on('connect', (socket) => {
    console.log(socket.id, " has joined our server!")
    
    socket.emit('welcome', "Welcome to the server!")

    socket.on('thanks', (data) => {
        console.log(data)
    })
})