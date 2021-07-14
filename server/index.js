const http = require("http");
const express = require("express");
const cors = require("cors");
const socketIO = require("socket.io");

const router = require('./routes');

const { addUser , removeUser , getUser , getUsersInRoom } = require('./users')

const app = express()
app.use(cors())
const server = http.createServer(app);
// app.use(cors()); //for intercommunication between urls

const port = process.env.PORT || 3001;

const io = socketIO(server,{cors: true,
    origins:["http://localhost:3000"]});

io.on("connection",(socket)=>{
    console.log("New Connection");
    socket.on('join',({name,room},callback)=> {
        // const error = true;
        // if(error){
        //     callback({error:"error hssh"});
        // }
        // console.log(name,room)
        const { error , user } = addUser({id: socket.id,name,room});
        
        if(error) return callback(error);

        socket.emit('message',{ user: 'Team GC', text: `Hey! ${user.name}, Welcome to the room ${user.room}`});

        socket.broadcast.to(user.room).emit('message',{ user:'admin',text:`${user.name} has joined!`});

        socket.join(user.room);

        io.to(user.room).emit('roomData',{ room: user.room,users:getUsersInRoom(user.room)});

        callback();
    })
    socket.on('sendMessage',(message,isImage,callback)=>{
        const user = getUser(socket.id);
        
        io.to(user.room).emit('message',{ user:user.name,text:message,isImage:isImage});
        io.to(user.room).emit('roomData',{ room:user.room,users:getUsersInRoom(user.room)});
        
        callback();
    })
    socket.on('image',(image,callback)=>{
        const user = getUser(socket.id);

        io.to(user.room).emit('image',{ user:user.name,image:image});
        io.to(user.room).emit('roomData',{ room:user.room,users:getUsersInRoom(user.room)});
        
        callback();
    })
    socket.on('typing',()=>{
        const user = getUser(socket.id);
        socket.broadcast.to(user.room).emit('typing',{ user:'',text:`${user.name} is typing... `});
    })
    socket.on("not typing",()=>{
        const user = getUser(socket.id);
        socket.broadcast.to(user.room).emit('not typing',{ user:'',text:`${user.name} is typing... `});

    })
    socket.on("disconnect",()=>{
        const user = removeUser(socket.id);
        if(user){
            io.to(user.room).emit("message",{user:"admin",text:`${user.name} has left.`})
        }
    })
})

app.use(router);


server.listen(port,()=>{
    console.log(`server is running on port ${port}`)
})