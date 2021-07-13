import React from 'react'
import './Message.css'

export default function Message({message : {user , text},name}) {
    let self = false;
    if(user === name.trim().toLowerCase()){
        self = true
    }
    return (
        self ? 
        (
            <div className="self-messages">
                <p>{text}</p>
                <p>{name.trim().toLowerCase()}</p>
            </div>
        ) : 
        (
            <div className="others-messages">
                <p>{text}</p>
                <p>{user}</p>
            </div>
        )
    )
}
