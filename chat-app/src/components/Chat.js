import React , {useState , useEffect} from 'react'
import queryString from 'query-string'
import io from 'socket.io-client'
import './Chat.css'

let socket; 

export default function Chat({location}) {
    const [ name , setName ] = useState("");
    const [ room , setRoom ] = useState("");
    const ENDPOINT = "localhost:3001";

    useEffect(()=>{
        const { name , room } = queryString.parse(location.search);

        socket = io();

        setName(name);
        setRoom(room);

        socket.emit('join' , { name:name,room:room })
    },[ENDPOINT,location.search])
    return (
        <div>
            
        </div>
    )
}

