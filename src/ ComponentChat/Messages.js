import React, { useEffect, useState } from 'react';
import Message from './Message';
import { useSelector, useDispatch } from 'react-redux';
import { onSnapshot, doc, collection } from 'firebase/firestore';
import { db } from '../firebase';
import { setChatId } from '../Redux/Slicefiles/ChatSlice'; // Import setChatId action
import GroupMessage from './GroupMessaage';

function Messages() {
    const [messages, setMessages] = useState([]);
    const [gmessages, setGMessages] = useState([]);
    const dispatch = useDispatch();
    const chatId = useSelector(state => state.chat.chatId); // Get chatId from Redux store
    const grpId = useSelector(state => state.grp.grpId); // Get grpId from Redux store

    console.log(chatId, grpId)
    useEffect(() => {
        let unsubscribe;
        const fetchMessages = async () => {
            if (grpId) {
                unsubscribe = onSnapshot(doc(db, "groups", grpId), (doc) => {
                    doc.exists() && setGMessages(doc.data().messages);
                    setMessages(null)
                });
            } else if (chatId) {
                // If it's an individual chat, fetch messages from the chats collection
                unsubscribe = onSnapshot(doc(db, "chats", chatId), (doc) => {
                    doc.exists() && setMessages(doc.data().messages);
                    setGMessages(null)
                });
            }
        };
        fetchMessages();

        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, [chatId, grpId]);

    console.log("messages", messages);
    
    return (
        <>
        {messages &&
        <div className='messagees'>
            {messages.map((m, index) => (
                <Message messages={m} key={index} />
            ))}
        </div>
        }
        {gmessages &&
        <div className='messagees'>
            {gmessages.map((m, index) => (
                <GroupMessage gmessages={m} key={index} />
            ))}
        
        </div>
        }
        </>
    );
}

export default Messages;
