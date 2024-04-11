import React from 'react'
import Sidebar from '../ ComponentChat/Sidebar'
import Chat from '../ ComponentChat/Chat'

function Main() {
    return (
        <div className='home'>
            <div className='container'>
                <Sidebar />
                <Chat />
            </div>

        </div>
    )
}

export default Main