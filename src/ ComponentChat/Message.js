import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { auth } from '../firebase';

function Message(message) {

    const currentUser = useSelector((state) => state.auth.currentUser);
    console.log("search :", currentUser);

    const { displayName, photoURL } = useSelector((state) => state.auth);
    console.log("displayName", auth.currentUser.displayName);

    const { chatId, user } = useSelector(state => state.chat);
    const { grpId } = useSelector(state => state.grp);
    console.log("chatId in msg", chatId);
    console.log("user", user);
    console.log("grpId", grpId);
    const ref = useRef()
    useEffect(() => {
        ref.current?.scrollIntoView({ behavior: "smooth" })
    })

    console.log("message.messages.senderId ", message.messages.senderId);
    console.log(message);

    return (
        <div
            ref={ref}
            className={`message ${message.messages.senderId === currentUser && "owner"}`}
        >
            <div className='messageInfo'>
                <img className='img3' src={message.messages.senderId === currentUser ? auth.currentUser.photoURL : user.currentUser.photoURL} alt="User" />

                <span>{message.messages.senderId === currentUser ? auth.currentUser.displayName : user.currentUser.displayName} </span>
            </div>
            <div className='messageContent'>
                <p className='p'> {message.messages.text} </p>
                {user.currentUser.photoURL && <img className="img3" src={message.messages.img} />}
            </div>
        </div>
    );
}

export default Message;
