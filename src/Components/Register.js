import React, { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, storage, db } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCurrentUser } from '../Redux/Slicefiles/AuthenticSlice'


function Register() {
    const [err, setErr] = useState(false);
    const [file, setFile] = useState(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();

 

    const handleSubmit = async (e) => {
        e.preventDefault();
        const displayName = e.target[0].value;
        const email = e.target[1].value;
        const password = e.target[2].value;

        try {
            const res = await createUserWithEmailAndPassword(auth, email, password);

            const storageRef = ref(storage, displayName);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on('state_changed',
                null,
                (error) => {
                    setErr(true);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                        await updateProfile(res.user, {
                            displayName,
                            photoURL: downloadURL
                        });
                        await setDoc(doc(db, "users", res.user.uid), {
                            uid: res.user.uid,
                            displayName,
                            email,
                            photoURL: downloadURL
                        });
                        await setDoc(doc(db, "userChats", res.user.uid), {});

                        dispatch(setCurrentUser({ uid: res.user.uid, displayName, photoURL: downloadURL, file }));
                        navigate("/login")
                    });
                }
            );

        } catch (err) {
            setErr(true);
        }
    };



    return (
        <div className='formContainer'>
            <div className='formWrapper'>
                <span className='logo'>Chat App</span>
                <span className='title'>Register</span>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3 row">
                        <div className="col-sm-12">
                            <input type="text" className="form-control" placeholder='Name' />
                        </div>
                    </div>
                    <div className="mb-3 row">
                        <div className="col-sm-12">
                            <input type="email" className="form-control" id="email" placeholder='Email' />
                        </div>
                    </div>
                    <div className="mb-3 row">
                        <div className="col-sm-12">
                            <input type="password" className="form-control" id="password" placeholder='Enter Password' />
                        </div>
                    </div>
                    <div className="mb-3 row">
                        <div className="col-sm-12">
                            <input type="file" className="form-control" id="file" onChange={(e) => setFile(e.target.files[0])} />
                        </div>
                    </div>
                    <button type="submit">Sign Up</button>
                    {err && <span>Something went wrong</span>}
                </form>
                <p>You do have an account ? <Link to="/Login">Login</Link></p>
            </div>
        </div>
    );
}

export default Register;
