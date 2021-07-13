const http = require("http");
const express = require("express");
const cors = require("cors");
const socketIO = require("socket.io");

const router = require('./routes');

const app = express()
const server = http.createServer(app);
app.use(cors()); //for intercommunication between urls

const port = process.env.PORT || 3001;

const io = socketIO(server);

io.on("connection",(socket)=>{
    console.log("New Connection");
    socket.on("disconnect",()=>{
        console.log("User disconnected");
    })
})

app.use(router);


server.listen(port,()=>{
    console.log(`server is running on port ${port}`)
})