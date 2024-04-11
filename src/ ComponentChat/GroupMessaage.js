import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { auth } from '../firebase';
import { onSnapshot, doc, collection } from 'firebase/firestore';
import { db } from '../firebase';

function GroupMessage(message) {
    const [senderInfo, setSenderInfo] = useState(null);

    const currentUser = useSelector((state) => state.auth.currentUser);
    const { grpId } = useSelector(state => state.grp);
    const ref = useRef();

    useEffect(() => {
        ref.current?.scrollIntoView({ behavior: "smooth" });
    });


console.log(message)
    return (
        <div
        ref={ref}
        className={`message owner`}
    >
                <div className='messageInfo'>
                    <img className='img3' src={message.gmessages.photoURL} alt="User" />
                    <span>{message.gmessages.displayName}</span>
                </div>
        <div className='messageContent'>
            <p className='p'> {message.gmessages.text} </p>
        </div>
    </div>
    );
}

export default GroupMessage;
