import React, { useState, useEffect } from "react";
import queryString from "query-string";
import { Link } from "react-router-dom";
import io from "socket.io-client";
import ScrollToBottom from "react-scroll-to-bottom";
import "./Chat.css";
import pic from "../ghost.png";
import send from "../send.png";
import Message from "./Message/Message";
import ReactFileReader from 'react-file-reader';

let socket;

export default function Chat({ location }) {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [users, setUsers] = useState("");
  const [ typing , setTyping ] = useState(false);
  const [ file , setFile ] = useState();

  const ENDPOINT = "localhost:3001";

  useEffect(() => {
    const { name, room } = queryString.parse(location.search);

    socket = io(ENDPOINT);
    // console.log(socket)

    setName(name);
    setRoom(room);

    // console.log("client",name,room)

    socket.emit("join", { name, room }, () => {});

    return () => {
      socket.emit("disconnect");
      socket.off();
    };
  }, [ENDPOINT, location.search]);

  useEffect(() => {
    socket.on("message", (message) => {
      setMessages((messages) => [...messages, message]);
    });

    socket.on("roomData", ({ users }) => {
      setUsers(users);
    });
  },[]);

    useEffect(()=>{
        socket.on("typing",(message)=>{
            setTyping(true);
            console.log("Typing from server",message);
        })
    },[])

  const sendMessage = (e) => {
    e.preventDefault();
    if (message) {
      // console.log(message)
      socket.emit("sendMessage", message,false, () => setMessage(""));
    }
  };

  const handleChange = files => {
    setFile(files.base64);
    console.log(files,file);
  }

  const [baseImage, setBaseImage] = useState("");

  const uploadImage = async (e) => {
    const file = e.target.files[0];
    const base64 = await convertBase64(file);
    // setBaseImage(base64);
    if(base64){
      socket.emit("sendMessage", base64,true, () => setBaseImage(""));
    }
    
  };

  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);

      fileReader.onload = () => {
        resolve(fileReader.result);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };



  return (
    <div className="main-chat">
      <div className="title">
        <h2>
          <Link to="/">GHOST CHAT</Link>
        </h2>
      </div>
      <div className="chat-container">
        <div className="top-container">
          <img src={pic} alt="GC" className="tiny-img" />
          <div>
            <div>
              <h3>{room}</h3>
            </div>
            <div className="users">
                {users && users.map(({ name },index) => <p key={index}>{name} {index < users.length-1 && <span>,&nbsp;</span>}</p>)}
            </div>
          </div>
        </div>
        <ScrollToBottom className="all-messages">
          {messages.map((message, index) => (
            <div key={index}>
              <Message message={message} name={name} />
            </div>
          ))}
        </ScrollToBottom>
        <input
        type="file"
        onChange={(e) => {
          uploadImage(e);
        }}
        id="imgBox"
        className={{display:"none"}}
      />
        <div className="input-box">
          <button className="photo-btn" onClick={()=>document.getElementById("imgBox").click()}>+</button>
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => (e.key === "Enter" ? sendMessage(e) : null)}
            // onKeyPress={(e)=>(e.key !== "Enter" ? startTyping(e) : null)}
            // onKeyUp={(e)=>stopTyping(e)}
          />
          <button onClick={(e) => sendMessage(e)}>
            <img src={send} alt="send" />
          </button>
        </div>
      </div>
    </div>
  );
}
