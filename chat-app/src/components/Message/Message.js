import React from 'react'
import ReactEmoji from 'react-emoji'
import './Message.css'


export default function Message({message : {user , text},name}) {
    let self = false;
    if(user === name.trim().toLowerCase()){
        self = true;
    }
    return (
        self ? 
        (
            <div className="self-messages">
                <p>You</p>
                <h4>{ReactEmoji.emojify(text)}</h4>
            </div>
        ) : 
        (
            <div className="others-messages">
                <p>{user}</p>
                <h4>{ReactEmoji.emojify(text)}</h4>
            </div>
        )
    )
}
