import React, { useState, useEffect } from "react";
import queryString from "query-string";
import { Link } from "react-router-dom";
import io from "socket.io-client";
import ScrollToBottom from "react-scroll-to-bottom";
import "./Chat.css";
import pic from "../ghost.png";
import send from "../send.png";
import Message from "./Message/Message";

let socket;

export default function Chat({ location }) {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [users, setUsers] = useState("");

  const ENDPOINT = "https://react-ghost-chat.herokuapp.com/";

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
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message) {
      socket.emit("sendMessage", message, () => setMessage(""));
    }
  };

  // console.log(messages,message)
  console.log(users);

//   const onlineUsers = () => (
//     // <div className="users">
//     //   {users && users.map(({ name },index) => <p key={index}>{name} {index >= users.length && <span>,</span>}</p>)}
//     // </div>
//   );

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
        <div className="input-box">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => (e.key === "Enter" ? sendMessage(e) : null)}
          />
          <button onClick={(e) => sendMessage(e)}>
            <img src={send} alt="send" />
          </button>
        </div>
      </div>
    </div>
  );
}
