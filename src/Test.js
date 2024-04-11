
import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from '../firebase';
import { useSelector } from 'react-redux';
import uuid from 'react-uuid';

function Search() {
    const [username, setUsername] = useState("");
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [user, setUser] = useState("");
    const [err, setErr] = useState(false);
    const currentUser = useSelector((state) => state.auth.currentUser);
    const [allUsersDisplayNames, setAllUsersDisplayNames] = useState([]);
    const [showInputField, setShowInputField] = useState(false);
    const [groupName, setGroupName] = useState("");

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const usersRef = collection(db, 'users');
                const querySnapshot = await getDocs(usersRef);
                const displayNames = querySnapshot.docs.map(doc => doc.data().displayName);
                setAllUsersDisplayNames(displayNames);
            } catch (err) {
                console.error('Error getting users:', err);
            }
        };
        fetchUsers();
    }, []);

    const handleSearch = async () => {
        console.log(username);
        const q = query(
            collection(db, "users"),
            where("displayName", "==", username)
        );

        try {
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                setUser(doc.data());
            });
        } catch (err) {
            setErr(true);
        }
    };

    const handleKey = (e) => {
        e.code === "Enter" && handleSearch();
        console.log(username);
    };

    const handleSelect = () => {
        if (user) {
            setSelectedUsers([...selectedUsers, user]);
            setUser("");
            setUsername("");
        }
    };

    const handleCreateGroup = () => {
        setShowInputField(true);
    };

    const onCreateGroup = async () => {
        if (groupName && selectedUsers.length >= 1) {
            try {
                const newGroupId = uuid();
                const groupData = {
                    groupName: groupName,
                    participants: selectedUsers.map(user => user.uid)
                };

                // Create the group document
                await setDoc(doc(db, "groups", newGroupId), groupData);

                // Add this group to each participant's list of groups
                selectedUsers.forEach(async (participant) => {
                    await setDoc(doc(db, `userGroups/${participant.uid}`), {
                        [newGroupId]: {
                            groupId: newGroupId,
                            lastUpdated: serverTimestamp()
                        }
                    }, { merge: true });

                });

                // Reset state
                setGroupName("");
                setSelectedUsers([]);
                setShowInputField(false);

                alert("Group created successfully!");
            } catch (err) {
                console.error("Error creating group:", err);
            }
        } else {
            alert("Please enter a group name and add at least one participant.");
        }
    };

    return (
        <div className='search'>
            <div className='searchForm'>
                <input
                    type='text'
                    placeholder='Search'
                    onKeyDown={handleKey}
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                />
                <button type="button" onClick={handleSearch} className="btn btn-primary">find the user</button>

                <button type="button" onClick={handleCreateGroup} className="btn btn-secondary">Create a Group</button>
                <input
                    type='text'
                    placeholder='Search'
                    onKeyDown={handleKey}
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                />
                <button type="button" onClick={handleSearch} className="btn btn-primary">Search</button>
            </div>

            {showInputField && (
                <div>
                    <h3>Enter group name:</h3>
                    <input type="text"
                        className="form-control"
                        placeholder='Enter group name'
                        value={groupName}
                        onChange={e => setGroupName(e.target.value)}
                    />
                    <h3>Add Participants:</h3>
                    <div>
                        {selectedUsers.map((user, index) => (
                            <div key={index}>{user.displayName}</div>
                        ))}
                    </div>
                    <button type="button" onClick={onCreateGroup} className='btn'>Create Group</button>
                </div>
            )}

            {err && <span>User not found</span>}
            {user && (
                <div>
                    <div className='userChat ' onClick={handleSelect}>
                        <img className="img" src={user.photoURL} alt={user.displayName} />
                        <div className='userChatInfo'>
                            <span> {user.displayName}</span>
                        </div>
                    </div>
                </div>
            )}

            {selectedUsers.length > 0 && (
                <div>
                    <h2>Selected Users:</h2>
                    <ul>
                        {selectedUsers.map((user, index) => (
                            <li key={index}>{user.displayName}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default Search;




// function Search() {
//     const [username, setUsername] = useState("");
//     const [selectedUsers, setSelectedUsers] = useState([]);
//     const [user, setUser] = useState("");
//     const [err, setErr] = useState(false);
//     const [showDropdown, setShowDropdown] = useState(false);



//     const { chatId } = useSelector(state => state.chat);

//     const currentUser = useSelector((state) => state.auth.currentUser);
//     console.log("search :", currentUser);

//     const [allUsersDisplayNames, setAllUsersDisplayNames] = useState([]);

//     useEffect(() => {
//         const fetchUsers = async () => {
//             try {
//                 const usersRef = collection(db, 'users');
//                 const querySnapshot = await getDocs(usersRef);
//                 const displayNames = querySnapshot.docs.map(doc => doc.data().displayName);
//                 setAllUsersDisplayNames(displayNames);
//             } catch (err) {
//                 console.error('Error getting users:', err);
//             }
//         };
//         fetchUsers();
//     }, []);

//     const handleSearch = async () => {
//         console.log(username);
//         const q = query(
//             collection(db, "users"),
//             where("displayName", "==", username)
//         );

//         try {
//             const querySnapshot = await getDocs(q);
//             querySnapshot.forEach((doc) => {
//                 setUser(doc.data());
//             });
//         } catch (err) {
//             setErr(true);
//         }
//     };

//     const handleKey = (e) => {
//         e.code === "Enter" && handleSearch();
//         console.log(username);
//     };

//     const handleSelect = async () => {

//         setSelectedUsers([...selectedUsers, user]);
//         console.log("selectedUsers", selectedUsers);
//         const combinedId =
//             currentUser > user.uid
//                 ? currentUser + user.uid
//                 : user.uid + currentUser;
//         console.log("user.uid", user.uid);
//         console.log("currentUser", currentUser);
//         console.log("combinedId", combinedId);
//         try {
//             const res = await getDoc(doc(db, "userChats", combinedId));

//             if (!res.exists()) {
//                 //create a chat in chats collection
//                 await setDoc(doc(db, "chats", combinedId), { messages: [] });

//                 //create user chats
//                 await updateDoc(doc(db, "userChats", currentUser), {
//                     [combinedId + ".userInfo"]: {
//                         uid: user.uid,
//                         displayName: user.displayName,
//                         photoURL: user.photoURL,
//                     },
//                     [combinedId + ".date"]: serverTimestamp(),
//                 });

//                 await updateDoc(doc(db, "userChats", user.uid), {
//                     [combinedId + ".userInfo"]: {
//                         uid: currentUser,
//                         displayName: currentUser.displayName,
//                         photoURL: currentUser.photoURL,
//                     },
//                     [combinedId + ".date"]: serverTimestamp(),
//                 });
//             }
//         } catch (err) { }
//         setUser(null);
//         setUsername("");
//     };

//     useEffect(() => {
//         const unsub = onSnapshot(doc(db, "group", chatId), (doc) => {
//             doc.exists() && setMessages(doc.data().messages)
//         })
//         return () => {
//             unsub()
//         }
//     }, [chatId])

//     const groupAdd = async () => {
//         const combinedIds = selectedUsers.map(u => u.uid + currentUser).join('');
//         console.log("Combined IDs:", combinedIds);

//         console.log(" user.uid", user.uid);
//         const combinedId =
//             currentUser > user.uid
//                 ? currentUser + user.uid
//                 : user.uid + currentUser;
//         try {
//             const res = await getDoc(doc(db, "group", combinedId));
//             if (!res.exists()) {
//                 await setDoc(doc(db, "group", uuid()), { messages: [] })

//                 //user chat 
//                 await updateDoc(doc(db, "userChats", currentUser), {
//                     [combinedId + ".userInfo"]: {
//                         uid: user.uid,
//                         displayName: user.displayName,
//                         photoURL: user.photoURL
//                     },
//                     [combinedId + ".date"]: serverTimestamp()
//                 });
//                 await updateDoc(doc(db, "userChats", user.uid), {
//                     [combinedId + ".userInfo"]: {
//                         uid: currentUser,
//                         displayName: currentUser.displayName,
//                         photoURL: currentUser.photoURL
//                     },
//                     [combinedId + ".date"]: serverTimestamp()
//                 })
//             }
//         } catch (err) {
//         }
//     };
//     return (
//         <div className='search'>
//             <div className='searchForm'>
//                 <input
//                     type='text'
//                     placeholder='Search'
//                     onKeyDown={handleKey}
//                     value={username}
//                     onChange={e => setUsername(e.target.value)}
//                 />
//                 <button type="button" onClick={groupAdd} className="btn btn-secondary">Create a group</button>
//             </div>

//             {err && <span>User not found</span>}
//             {user && (
//                 <div>
//                     <div className='userChat' onClick={handleSelect}>
//                         <img className="img" src={user.photoURL} alt={user.displayName} />
//                         <div className='userChatInfo'>
//                             <span> {user.displayName}</span>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );

// }
// export default Search
[
    {
        "displayName": "nj",
        "email": "nj@gmail.com",
        "photoURL": "https://firebasestorage.googleapis.com/v0/b/chatapp-42f83.appspot.com/o/nj?alt=media&token=eb1ca8d1-da4e-45ab-ab5b-5be1db9cdaf0",
        "uid": "r1ZIWIT4e6Ti2zV22gwEH8s8szw2"
    }
]/////-------------------------------------

// import { Timestamp, arrayUnion, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
// import React, { useState } from 'react';
// import { useSelector } from 'react-redux';
// import { db, storage } from '../firebase';
// import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
// import { v4 as uuid } from "uuid";
// import Attach from '../Img/attach.png';

// const Input = () => {
//     const [text, setText] = useState("");
//     const [img, setImg] = useState(null);
//     const currentUser = useSelector((state) => state.auth.currentUser);

//     const handleSend = async () => {
//         if (!currentUser) {
//             console.error("Error: currentUser is undefined");
//             return;
//         }

//         try {
//             if (img) {
//                 const storageRef = ref(storage, uuid());
//                 const uploadTask = uploadBytesResumable(storageRef, img);
//                 await uploadTask;
//                 const downloadURL = await getDownloadURL(storageRef);

//                 await updateDoc(doc(db, "chats", chatId), {
//                     messages: arrayUnion({
//                         id: uuid(),
//                         text,
//                         senderId: currentUser.uid,
//                         date: Timestamp.now(),
//                         img: downloadURL
//                     }),
//                 });
//             } else {
//                 await updateDoc(doc(db, "chats", chatId), {
//                     messages: arrayUnion({
//                         id: uuid(),
//                         text,
//                         senderId: currentUser.uid,
//                         date: Timestamp.now()
//                     }),
//                 });
//             }

//             await updateDoc(doc(db, "userChats", currentUser.uid), {
//                 [chatId + ".lastMessage"]: {
//                     text,
//                 },
//                 [chatId + ".date"]: serverTimestamp(),
//             });

//             await updateDoc(doc(db, "userChats", user.currentUser.uid), {
//                 [chatId + ".lastMessage"]: {
//                     text,
//                 },
//                 [chatId + ".date"]: serverTimestamp(),
//             });
//         } catch (error) {
//             console.error("Error uploading image or updating Firestore:", error);
//         }

//         setImg(null);
//         setText("");
//     };

//     const handleImageChange = (e) => {
//         setImg(e.target.files[0]);
//     };

//     return (
//         <div className="input">
//             <div className='textfield'>
//                 <input type="text" className="form-control" placeholder="Enter message" value={text} onChange={(e) => setText(e.target.value)} />
//             </div>
//             <div className="send">
//                 <label htmlFor="file">
//                     <img src={Attach} alt="Attach" />
//                 </label>
//                 <input
//                     type="file"
//                     id="file"
//                     style={{ display: "none" }}
//                     onChange={handleImageChange}
//                 />
//             </div>
//             <button type="button" onClick={handleSend} className='btn2'>Send</button>
//         </div>
//     );
// };

// export default Input;



// import React, { useEffect, useRef } from 'react';
// import { useSelector } from 'react-redux';
// import { auth } from '../firebase';

// function Message(message) {

//     const currentUser = useSelector((state) => state.auth.currentUser);
//     console.log("search :", currentUser);

//     const { displayName, photoURL } = useSelector((state) => state.auth);
//     console.log("displayName", auth.currentUser.displayName);

//     const { chatId, user } = useSelector(state => state.chat);
//     console.log("chatId in msg", chatId);
//     console.log("user", user);
//     const ref = useRef()
//     useEffect(() => {
//         ref.current?.scrollIntoView({ behavior: "smooth" })
//     })

//     console.log("message.messages.senderId ", message.messages.senderId);
//     console.log(message);

//     return (
//         <div
//             ref={ref}
//             className={`message ${message.messages.senderId === currentUser && "owner"}`}
//         >
//             <div className='messageInfo'>
//                 <img className='img3' src={message.messages.senderId === currentUser ? auth.currentUser.photoURL : user.currentUser.photoURL} alt="User" />

//                 <span>{message.messages.senderId === currentUser ? auth.currentUser.displayName : user.currentUser.displayName} </span>
//             </div>
//             <div className='messageContent'>
//                 <p className='p'> {message.messages.text} </p>
//                 {user.currentUser.photoURL && <img className="img3" src={message.messages.img} />}
//             </div>
//         </div>
//     );
// }

// export default Message;


// function Input() {
//     const [text, setText] = useState("");
//     const [img, setImg] = useState(null);



//     const currentUser = useSelector((state) => state.auth.currentUser);
//     console.log("search :", currentUser);

//     const { chatId, user } = useSelector(state => state.chat);
//     console.log("check chatId", chatId);

//     const handleSend = async () => {
//         if (!chatId) {
//             console.error("Error: chatId is undefined");
//             return;
//         }

//         if (!text) {
//             console.error("Error: text is undefined or empty");
//             return;
//         }

//         if (img) {
//             const storageRef = ref(storage, uuid());
//             const uploadTask = uploadBytesResumable(storageRef, img);

//             try {
//                 await uploadTask;

//                 const downloadURL = await getDownloadURL(storageRef);

//                 await updateDoc(doc(db, "chats", chatId), {
//                     messages: arrayUnion({
//                         id: uuid(),
//                         text,
//                         senderId: currentUser,
//                         date: Timestamp.now(),
//                         img: downloadURL
//                     }),
//                 });
//             } catch (error) {
//                 console.error("Error uploading image or updating Firestore:", error);
//             }
//         } else {
//             try {
//                 await updateDoc(doc(db, "chats", chatId), {
//                     messages: arrayUnion({
//                         id: uuid(),
//                         text,
//                         senderId: currentUser,
//                         date: Timestamp.now()
//                     }),
//                 });
//             } catch (error) {
//                 console.error("Error updating Firestore:", error);
//             }
//         }
//     };


//     return (
//         <div className='input'>
//             <div className="col-sm-10">
//                 <input
//                     type="text"
//                     className="form-control-plaintext"
//                     placeholder="Enter message"
//                     onChange={e => setText(e.target.value)}
//                 />
//             </div>
//             <div className='send'>
//                 <input
//                     type='file'
//                     style={{ display: 'none' }}
//                     id='file'
//                     onChange={e => setImg(e.target.files[0])}
//                 />

//                 <button onClick={handleSend} className='btn2'>Send</button>
//             </div>
//         </div>
//     );
// }

// export default Input;

// function Search() {
//     const [username, setUsername] = useState("");
//     const [user, setUser] = useState(null);
//     const [err, setErr] = useState(false);
//     const [showDropdown, setShowDropdown] = useState(false);
//     const [currentUser, setCurrentUser] = useState(null);

//     useEffect(() => {
//         setCurrentUser(JSON.parse(localStorage.getItem("currentUser")));
//     }, []);

//     const [allUsersDisplayNames, setAllUsersDisplayNames] = useState([]);

//     // Your existing code for fetching users and handling search

//     const handleSelect = async () => {
//         if (!currentUser || !user) return;

//         const combinedId =
//             currentUser.uid > user.uid
//                 ? currentUser.uid + user.uid
//                 : user.uid + currentUser.uid;

//         try {
//             const res = await getDoc(doc(db, "userChats", combinedId));

//             if (!res.exists()) {
//                 await setDoc(doc(db, "chats", combinedId), { messages: [] });

//                 await updateDoc(doc(db, "userChats", currentUser.uid), {
//                     [combinedId]: {
//                         userInfo: {
//                             uid: user.uid,
//                             displayName: user.displayName,
//                             photoURL: user.photoURL,
//                         },
//                         date: serverTimestamp(),
//                     },
//                 });

//                 await updateDoc(doc(db, "userChats", user.uid), {
//                     [combinedId]: {
//                         userInfo: {
//                             uid: currentUser.uid,
//                             displayName: currentUser.displayName,
//                             photoURL: currentUser.photoURL,
//                         },
//                         date: serverTimestamp(),
//                     },
//                 });
//             }
//         } catch (err) {
//             console.error("Error creating group chat:", err);
//         }
//         setUser(null);
//         setUsername("");
//     };

//     const handleAdd = async (e) => {
//         e.preventDefault();
//         setShowDropdown(true);
//     };

//     return (
//         <div className='search'>
//             <div className='searchForm'>
//                 <input
//                     type='text'
//                     placeholder='find a user'
//                     onKeyDown={handleKey}
//                     value={username}
//                     onChange={(e) => setUsername(e.target.value)}
//                 />

//                 <img
//                     style={{ marginLeft: '190px' }}
//                     src={Add}
//                     alt='Groupicon'
//                     onClick={handleAdd}
//                 />

//                 {showDropdown && (
//                     <select className="form-select" aria-label="Default select example">
//                         <option selected>Add to group</option>
//                         {allUsersDisplayNames.map((displayName, index) => (
//                             <option key={index} value={displayName}>{displayName}</option>
//                         ))}
//                     </select>
//                 )}
//             </div>

//             {err && <span>User not found</span>}
//             {user && (
//                 <div>
//                     <div className='userChat' onClick={handleSelect}>
//                         <img className="img" src={user.photoURL} alt={user.displayName} />
//                         <div className='userChatInfo'>
//                             <span> {user.displayName}</span>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }

// export default Search;

// import React, { useState, useEffect } from 'react';
// import { collection, getDocs } from 'firebase/firestore';
// import { db } from '../firebase';

// function Search() {
//     const [username, setUsername] = useState('');
//     const [user, setUser] = useState(null);
//     const [err, setErr] = useState(false);
//     const [allUsersDisplayNames, setAllUsersDisplayNames] = useState([]);
//     const [selectedUsers, setSelectedUsers] = useState([]);
//     const [showDropdown, setShowDropdown] = useState(false);

//     useEffect(() => {
//         const fetchUsers = async () => {
//             try {
//                 const usersRef = collection(db, 'users');
//                 const querySnapshot = await getDocs(usersRef);
//                 const displayNames = querySnapshot.docs.map(doc => doc.data().displayName);
//                 setAllUsersDisplayNames(displayNames);
//             } catch (err) {
//                 console.error('Error getting users:', err);
//             }
//         };
//         fetchUsers();
//     }, []);

//     const handleSearch = async () => {
//         // Your existing handleSearch logic
//     };

//     const handleKey = (e) => {
//         // Your existing handleKey logic
//     };

//     const handleSelect = (selectedUser) => {
//         setSelectedUsers(prevState => [...prevState, selectedUser]);
//     };

//     const handleAdd = async (e) => {
//         e.preventDefault();
//         setShowDropdown(true);

//         // Your existing handleAdd logic
//     };

//     const handleCreateGroup = async () => {
//         // Your existing handleAdd logic
//     };

//     return (
//         <div className='search'>
//             <div className='searchForm'>
//                 <input type='text' placeholder='find a user' onKeyDown={handleKey} value={username} onChange={e => setUsername(e.target.value)} />
//                 <button onClick={handleAdd}>Add</button>
//             </div>
//             {showDropdown && (
//                 <div className='dropdown'>
//                     <button className='btn btn-secondary dropdown-toggle' type='button' id='dropdownMenuButton' data-bs-toggle='dropdown' aria-expanded='false'>
//                         Select Users
//                     </button>
//                     <ul className='dropdown-menu' aria-labelledby='dropdownMenuButton'>
//                         {allUsersDisplayNames.map((displayName, index) => (
//                             <li key={index}><a className='dropdown-item' href='#' onClick={() => handleSelect(displayName)}>{displayName}</a></li>
//                         ))}
//                     </ul>
//                 </div>
//             )}
//             <div>
//                 Selected Users:
//                 {selectedUsers.map((selectedUser, index) => (
//                     <span key={index}>{selectedUser}, </span>
//                 ))}
//             </div>
//             {showDropdown && <button onClick={handleCreateGroup}>Create Chat Group</button>}
//             {err && <span>User not found</span>}
//             {user && (
//                 <div>
//                     <div className='userChat' onClick={handleSelect}>
//                         {/* Your existing user chat display */}
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }

// export default Search;

function Search() {
    const [username, setUsername] = useState("");
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [err, setErr] = useState(false);
    const { chatId } = useSelector(state => state.chat);
    const currentUser = useSelector((state) => state.auth.currentUser);
    const [allUsersDisplayNames, setAllUsersDisplayNames] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const usersRef = collection(db, 'users');
                const querySnapshot = await getDocs(usersRef);
                const displayNames = querySnapshot.docs.map(doc => doc.data().displayName);
                setAllUsersDisplayNames(displayNames);
            } catch (err) {
                console.error('Error getting users:', err);
            }
        };
        fetchUsers();
    }, []);

    const handleSearch = async () => {
        console.log(username);
        const q = query(
            collection(db, "users"),
            where("displayName", "==", username)
        );

        try {
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                setUser(doc.data());
            });
        } catch (err) {
            setErr(true);
        }
    };

    const handleKey = (e) => {
        e.code === "Enter" && handleSearch();
        console.log(username);
    };

    const handleSelect = async () => {
        // Handle selecting users
    };

    const groupAdd = async () => {
        const combinedIds = selectedUsers.map(u => u.uid + currentUser).join('');
        console.log("Combined IDs:", combinedIds);
        // Add logic to create group with combined IDs
    };

    return (
        <div className='search'>
            <div className='searchForm'>
                <input
                    type='text'
                    placeholder='Search'
                    onKeyDown={handleKey}
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                />
                <button type="button" onClick={groupAdd} className="btn btn-secondary">Create a group</button>
            </div>

            {err && <span>User not found</span>}
            {user && (
                <div>
                    <div className='userChat' onClick={handleSelect}>
                        <img className="img" src={user.photoURL} alt={user.displayName} />
                        <div className='userChatInfo'>
                            <span> {user.displayName}</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

}
export default Search;
