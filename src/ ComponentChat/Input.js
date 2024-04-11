import { Timestamp, arrayUnion, updateDoc, serverTimestamp } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { db,auth, storage } from '../firebase';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { v4 as uuid } from "uuid";
import Attach from '../Img/attach.png'
import Img from '../Img/img.png'
import { onSnapshot, doc, collection, where, query } from 'firebase/firestore';

// import { changeUser } from '../Redux/Slicefiles/ChatSlice';


const Input = () => {
    const [text, setText] = useState("");
    const [img, setImg] = useState("");
    // const dispatch = useDispatch();

    const currentUser = useSelector((state) => state.auth.currentUser);;
    const {  displayName, photoURL } = useSelector((state) => state.auth);
    console.log("displayName", auth.currentUser.displayName);
    console.log("search :", currentUser);
    localStorage.setItem('currentUser', JSON.stringify(currentUser));

    const { chatId, user } = useSelector(state => state.chat);
    const { grpId } = useSelector(state => state.grp);

    // dispatch(changeUser({ currentUser: user }));

    console.log("check chatId", chatId);
    console.log("check grpId", grpId);
    console.log("user", user);
    console.log("uuid", uuid());

    const handleSend = async () => {
        if (!chatId) {
            console.error("Error: chatId is undefined");
            return;
        }
        // if (!text) {
        //     console.error("Error: text is undefined or empty");
        //     return;
        // }
        if (img) {
            const storageRef = ref(storage, uuid());
            const uploadTask = uploadBytesResumable(storageRef, img);

            try {
                await uploadTask;

                const downloadURL = await getDownloadURL(storageRef);

                await updateDoc(doc(db, "chats", chatId), {
                    messages: arrayUnion({
                        id: uuid(),
                        text,
                        senderId: currentUser,
                        date: Timestamp.now(),
                        img: downloadURL
                    }),
                });
            } catch (error) {
                console.error("Error uploading image or updating Firestore:", error);
            }
        } else {
            try {
                await updateDoc(doc(db, "chats", chatId), {
                    messages: arrayUnion({
                        id: uuid(),
                        text,
                        senderId: currentUser,
                        date: Timestamp.now()
                    }),
                });
            } catch (error) {
                console.error("Error updating Firestore:", error);
            }
            await updateDoc(doc(db, "userChats", currentUser), {
                [chatId + ".lastMessage"]: {
                    text,
                },
                [chatId + ".date"]: serverTimestamp(),
            });

            await updateDoc(doc(db, "userChats", user.currentUser.uid), {
                [chatId + ".lastMessage"]: {
                    text,
                },
                [chatId + ".date"]: serverTimestamp(),
            });

        }
        setImg(null);
        setText("");
    };
    const handleSendG = async () => {
        if (!grpId) {
            console.error("Error: chatId is undefined");
            return;
        }
        // if (!text) {
        //     console.error("Error: text is undefined or empty");
        //     return;
        // }
        if (img) {
            const storageRef = ref(storage, uuid());
            const uploadTask = uploadBytesResumable(storageRef, img);

            try {
                await uploadTask;

                const downloadURL = await getDownloadURL(storageRef);

                await updateDoc(doc(db, "groups", grpId), {
                    messages: arrayUnion({
                        id: uuid(),
                        text,
                        senderId: currentUser,
                        name: displayName,
                        photoURL: photoURL,
                        date: Timestamp.now(),
                        img: downloadURL
                    }),
                });
            } catch (error) {
                console.error("Error uploading image or updating Firestore:", error);
            }
        } else {
            try {
                console.log(auth.currentUser.displayName,photoURL)
                await updateDoc(doc(db, "groups", grpId), {
                    messages: arrayUnion({
                        id: uuid(),
                        text,
                        senderId: currentUser,
                        displayName:auth.currentUser.displayName,
                        photoURL:auth.currentUser.photoURL,
                        date: Timestamp.now()
                    }),
                });
            } catch (error) {
                console.error("Error updating Firestore:", error);
            }
        }
        setImg(null);
        setText("");
    };

    const handleImageChange = (e) => {
        setImg(e.target.files[0]);
    };

    return (

        <div >
            <div class="mb-3 row">
                <div class="col-sm-12 d-flex
                ">
                    <input type="text" className="form-control" placeholder="Enter message" value={text} onChange={(e) => setText(e.target.value)} />

                    <label htmlFor="file">
                        <img src={Attach} alt="Attach" />
                    </label>
                    <input
                        type="file"
                        id="file"
                        style={{ display: "none" }}
                        onChange={handleImageChange}
                    />
                    <div className="send">

                       {grpId ? <button type="button" onClick={handleSendG} className='btn'>Send</button> : <button type="button" onClick={handleSend} className='btn'>Send</button> } 
                    </div>
                </div>

            </div>

        </div>
    );
};

export default Input;


