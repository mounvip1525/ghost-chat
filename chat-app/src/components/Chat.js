import React , {useState , useEffect} from 'react'
import queryString from 'query-string'
import { Link } from 'react-router-dom'
import io from 'socket.io-client'
import ScrollToBottom from 'react-scroll-to-bottom'
import './Chat.css'
import pic from '../ghost.png';
import send from '../send.png'
import Message from './Message/Message'

 let socket;


export default function Chat({location}) {
    const [ name , setName ] = useState("");
    const [ room , setRoom ] = useState("");
    const [ messages , setMessages ] = useState([]);
    const [ message , setMessage ] = useState("");

    const ENDPOINT = "localhost:3001";

    useEffect(()=>{
        const { name , room } = queryString.parse(location.search);

        socket = io(ENDPOINT);
        console.log(socket)

        setName(name);
        setRoom(room);

        // console.log("client",name,room)

        socket.emit('join' , { name,room },()=>{
            
        });

        return () => {
            socket.emit('disconnect');
            socket.off();
        }
    },[ENDPOINT,location.search])

    useEffect(()=>{
        socket.on("message",(message) => {
            setMessages([...messages,message]);
        })
    },[messages])

    const sendMessage = (e) => {
        e.preventDefault();
        if(message) {
            socket.emit('sendMessage',message,()=> setMessage(''))
        }
    }

    console.log(messages,message)

    return (
        <div className="main-chat">
            <div className="title">
                <h2><Link to="/"><img src={pic} alt="GC" /></Link>{room}</h2>
            </div>
            <div className="chat-container">
                    <ScrollToBottom className="all-messages">
                    {messages.map((message,index)=> (
                        <div key={index}>
                            <Message message={message} name={name} />
                        </div>
                    ))}
                    </ScrollToBottom>
                <div className="input-box">
                    <input value={message} onChange={(e)=>setMessage(e.target.value)} onKeyPress={(e)=> e.key === 'Enter' ? sendMessage(e) : null} />
                    <button onClick={(e)=>sendMessage(e)}><img src={send} alt="send" /></button>
                </div>
            </div>
        </div>
    )
}

