const http = require("http");
const express = require("express");
const cors = require("cors");
const socketIO = require("socket.io");

const app = express()
const server = http.createServer(app);
app.use(cors()); //for intercommunication between urls

const port = 3001 || process.env.PORT;

app.get("/",(req,res)=>{
    res.send("OK");
})

const io = socketIO(server);

io.on("connection",()=>{
    console.log("New Connection");
})

server.listen(port,()=>{
    console.log(`server is running on port ${port}`)
})