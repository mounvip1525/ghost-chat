import React , {useState} from 'react'
import './Home.css'
import pic from '../ghost.png';
import { Link } from 'react-router-dom'

export default function Home() {
    const [ name , setName ] = useState("");
    const [ room , setRoom ] = useState("");
    return (
        <div className="wrapper-home">
        <nav className="nav">
          <h2>GHOST CHAT</h2>
          <a href="mailto:mounvip1525@gmail.com?Subject=Ghost%20Chat%20Bug">
            <h3>REPORT A BUG</h3>
          </a>
        </nav>
        <div className="main-home">
          <div className="text">
            <h1>chat anonymously</h1>
            <p>
              No signup required, chat anonymously with your buddies and have fun!
            </p>
            <img src={pic} alt="Ghost chat" />
          </div>
          <div className="hello">
            <div className="details">
              <h3>JOIN CHAT</h3>
              <div>
                <label for="name">NICKNAME</label>
                <input type="text" id="name" name="name" placeholder="Dread Pirate" onChange={(e)=>setName(e.target.value)}/>
              </div>
              <div>
                <label for="room">ROOM NAME</label>
                <input type="text" id="room" name="room" placeholder="Knight ghost" onChange={(e)=>setRoom(e.target.value)}/>
              </div>
              <div className="btn-container">
                <Link onClick={e=>(!name || !room) ? e.preventDefault() : null} to={`/chat?name=${name}&room=${room}`}>
                  <button className="join-btn">JOIN NOW</button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
}
