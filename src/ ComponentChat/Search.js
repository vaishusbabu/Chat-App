
import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from '../firebase';
import { useSelector } from 'react-redux';
import uuid from 'react-uuid';

function Search() {
    const [username1, setUsername1] = useState("");
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
    const handleKey1 = (e) => {
        e.code === "Enter" && handleSearch1();
        console.log(username1);
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
                    participants: selectedUsers.map(user => user.uid),
                    messages: [{
                        // text: lastMessage,
                        timestamp: Date.now(),

                    }],
                    date: serverTimestamp(),
                    admin: currentUser,
                };

                // Create the group document
                await setDoc(doc(db, "groups", newGroupId), groupData);


                // Add this group to each participant's list of groups "2e136e0e-9462-d86c-65e1-d63063ec3656"

                selectedUsers.forEach(async (participant) => {
                    await setDoc(doc(db, `userGroups/${participant.uid}`), {
                        [newGroupId]: {
                            // uid: user.uid,
                            groupId: newGroupId,
                            lastUpdated: serverTimestamp(),


                        }
                    }, { merge: true });

                });

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
    const handleSearch1 = async () => {
        console.log(username1);
        const q = query(
            collection(db, "users"),
            where("displayName", "==", username1)
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
    return (
        <div className='search'>
            <div className='searchForm'>
                <button type="button" onClick={handleCreateGroup} className="btn btn-secondary">Create a Group</button>
                <input
                    type='text'
                    placeholder='Search'
                    onKeyDown={handleKey1}
                    value={username1}
                    onChange={e => setUsername1(e.target.value)}
                />
                <button type="button" onClick={handleSearch1} className="btn btn-secondary">Search Users</button>
                <button type="button" onClick={handleCreateGroup} className="btn btn-secondary">Create a Group</button>

            </div>

            {showInputField && (
                <div>
                    <h3>Enter group name:</h3>
                    <input type="text"
                        className="form-control"
                        placeholder='Enter group name'
                        value={groupName}
                        onChange={e => setGroupName(e.target.value)}
                    /><br />

                    <input
                        type='text'
                        placeholder='Add Participants:'
                        onKeyDown={handleKey}
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                    />
                    <button type="button" onClick={handleSearch} className="btn btn-secondary">Search</button>

                    <div>
                        {selectedUsers.map((user, index) => (
                            <div style={{ color: "white" }} key={index}>{user.displayName}</div>
                        ))}
                    </div>
                    <button type="button" onClick={onCreateGroup} className='btn'>Create Group</button>
                </div>
            )}
            {/* {selectedUsers.map((user, index) => (
                <div key={index}>
                    <h6 style={{ color: "white" }}>     {user.groupName}</h6>
                </div>
            ))} */}


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


        </div>
    );
}

export default Search;
