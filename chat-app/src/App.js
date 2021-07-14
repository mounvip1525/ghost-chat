import './App.css';
import { Route , Switch } from "react-router-dom"
import  Home from './components/Home/Home';
import  Chat from './components/Chat/Chat';
// import socketIO from "socket.io-client"

// const ENDPOINT = "http://localhost:3001/";
// const socket = socketIO(ENDPOINT,{transports:['websocket']});


function App() {
  // socket.on("connect",()=>{
    
  // })
  return (
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/chat" component={Chat} />
    </Switch>
  );
}

export default App;
