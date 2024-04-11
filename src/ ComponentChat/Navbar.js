import React from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useSelector, useDispatch } from 'react-redux';
import { setCurrentUser } from '../Redux/Slicefiles/AuthenticSlice'


function Navbar() {
    const { currentUser, displayName, photoURL } = useSelector((state) => state.auth);

    console.log(auth);

    console.log("check :", currentUser);
    console.log("name", auth.currentUser.displayName);
    console.log("img", auth.currentUser.photoURL);

    const dispatch = useDispatch();

    const handleSignOut = () => {
        signOut(auth).then(() => {

            dispatch(setCurrentUser(null));
        }).catch((error) => {

            console.error('Sign out error:', error);
        });
    };

    return (
        <div className='navbar'>
            <div className='logo'>
                <span> Chat App</span>
            </div>
            <div className='user'>
                <img className='img' src={auth.currentUser.photoURL} alt="Img of user" />
                <span>{auth.currentUser.displayName} </span>
                <button className='btn' onClick={handleSignOut}> Logout</button>
            </div>
        </div>
    );
}

export default Navbar;
