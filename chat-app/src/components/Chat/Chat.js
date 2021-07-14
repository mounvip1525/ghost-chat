import React, { useState, useEffect } from "react";
import queryString from "query-string";
import { Link } from "react-router-dom";
import io from "socket.io-client";
import ScrollToBottom from "react-scroll-to-bottom";
import "./Chat.css";
import pic from "../../ghost.png";
import send from "../../send.png";
import Message from "../Message/Message";
import ImgCapture from '../ImgCapture/ImgCapture';

let socket;

export default function Chat({ location }) {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [users, setUsers] = useState("");
  const [ typing , setTyping ] = useState([]);
  const [ file , setFile ] = useState();

  const ENDPOINT = "localhost:3001";
  var timer;
  var timeout = 3000;

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

    socket.on("typing",(data)=>{
      setTyping(Array.from(new Set([...typing,data])));
      // console.log("typing",typing,data.text);
    })

    socket.on("not typing",(data)=>{
      // console.log("not typing",data)
      var deet = typing.filter(t=>t!== data.text);
      setTyping(deet);
    })
    
  },[]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message) {
      // console.log(message)
      socket.emit("sendMessage", message,false, () => setMessage(""));
    }
  };

  const uploadImage = async (e) => {
    const file = e.target.files[0];
    const base64 = await convertBase64(file);
    // setBaseImage(base64);
    if(base64){
      socket.emit("sendMessage", base64,true, () => console.log("Image sent"));
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

  const sendCapturedPhoto = (data) => {
    // console.log(data);
    if(data){
      socket.emit("sendMessage", data,true, () => console.log("Captured Image sent"));
    }
  }

  const startTyping = (e) => {
    // console.log("User is typing");
    socket.emit("typing");
  }

  const stopTyping = (e) => {
    clearTimeout(timer);
    if (message) {
        timer = setTimeout(function(){
            // console.log("user stopped");
            socket.emit("not typing");
        }, timeout);
    }
  }

  return (
    <>
    <div className="main-chat custom-scrollbar">
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
                {/* {users && users.map(({ name },index) => <p key={index}>{name} {index < users.length-1 && <span>,&nbsp;</span>}</p>)} */}
                {typing.length>0 ? typing.map(({text},index)=> <p key={index}>{text}</p>):
                           (users) && users.map(({ name },index) => <p key={index}>{name} {index < users.length-1 && <span>,&nbsp;</span>}</p>)
                }
            </div>
          </div>
        </div>
        <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          uploadImage(e);
        }}
        id="imgBox"
        style={{display:"none"}}
      />
        <ScrollToBottom className="all-messages">
          {messages.map((message, index) => (
            <div key={index}>
              <Message message={message} name={name} />
            </div>
          ))}
        </ScrollToBottom>
        <div className="input-box">
          <button className="photo-btn" onClick={()=>document.getElementById("imgBox").click()}>+</button>
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => (e.key === "Enter" ? sendMessage(e) : startTyping(e))}
            // onKeyPress={(e)=>(e.key !== "Enter" ?  : null)}
            onKeyUp={(e)=>stopTyping(e)}
          />
          <div className="send">
            {message ?         
            <button onClick={(e) => sendMessage(e)}>
            <img src={send} alt="send" />
          </button> : 
          <div className="send-cam"><ImgCapture send={sendCapturedPhoto}/></div>}
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
