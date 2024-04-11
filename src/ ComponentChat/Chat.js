import React from 'react'
import Input from './Input'
import Messages from './Messages';
import { useSelector } from 'react-redux';

function Chat() {
    const { chatId, user } = useSelector(state => state.chat);
    const { grpId, grpName } = useSelector(state => state.grp);

    return (
        <>
        {grpId ?
        <div className='chat'>
                <div className='chatInfo'>
                    {/* <img className='img33' src={gmessages./photoURL} /> */}
                    <span>{grpName}</span>
                </div>
            <Messages />
            <Input />
        </div>
        :
        <div className='chat'>
        {user.currentUser ? (
            <div className='chatInfo'>
                <img className='img33' src={user.currentUser.photoURL} />
                <span>{user.currentUser.displayName}</span>
            </div>
        ) : (
            <div>Chat Zone</div>
        )}

        <Messages />
        <Input />
    </div>
        }
        </>
    )
}

export default Chat
