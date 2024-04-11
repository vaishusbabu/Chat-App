// Chats.js

import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { useSelector, useDispatch } from "react-redux";
import { doc, onSnapshot, collection } from "firebase/firestore";
import { changeUser } from "../Redux/Slicefiles/ChatSlice"; // Import changeUser action
import { grouPId, grouPName } from "../Redux/Slicefiles/GroupSlice";
function Chats() {
  const [chats, setChats] = useState([]);
  const [groupChats, setGroupChats] = useState([]);
  const [displayMode, setDisplayMode] = useState("chats"); // Initially set to "chats"

  const currentUser = useSelector((state) => state.auth.currentUser);


  const dispatch = useDispatch();

  console.log(currentUser)

  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(doc(db, "userChats", currentUser), (doc) => {
        console.log("Current data: ", doc.data());
        setChats(doc.data());
      });
      return () => {
        unsub();
      };
    };
    currentUser && getChats();
  }, [currentUser]);

  useEffect(() => {
    const getGroupChats = () => {
      const unsub2 = onSnapshot(collection(db, "groups"), (snapshot) => {
        const groupChatsData = [];
        snapshot.forEach((doc) => {
          const groupChat = doc.data();
          if (groupChat.participants.includes(currentUser)) {
            groupChatsData.push({ ...groupChat, id: doc.id }); 
          }
        });
        setGroupChats(groupChatsData);
      });
      return () => {
        unsub2();
      };
    };
    currentUser && getGroupChats();
  }, [currentUser]);
console.log(groupChats)
  const handleSelect = (u) => {
    if (u.groupName) {
      console.log(u)
      dispatch(grouPId(u.id));
      dispatch(grouPName(u.groupName));
      // dispatch(changeUser(null));
    } else {
      console.log(u)
      dispatch(changeUser({ currentUser: u }));
      dispatch(grouPId(null));
    }
  };

  const toggleDisplayMode = (mode) => {
    setDisplayMode(mode);
  };

  return (
    <div className="chats">
      <div className="toggle-buttons">
        <button onClick={() => toggleDisplayMode("chats")}>Chats</button>
        <button onClick={() => toggleDisplayMode("groups")}>Groups</button>
      </div>
      {displayMode === "chats" && (
        Object.entries(chats)
          .sort((a, b) => b[1].date - a[1].date)
          .map((chat) => {
            const userInfo = chat[1].userInfo;
            if (!userInfo) {
              return null;
            }
            return (
              <div
                className="userChat"
                key={chat[0]}
                onClick={() => handleSelect(chat[1].userInfo)}
              >
                <div className="userChat">
                  <img className="img" src={userInfo.photoURL} />
                  <div className="userChatInfo">
                    <span> {userInfo.displayName} </span>
                    <p>{chat[1].lastMessage?.text}</p>
                  </div>
                </div>
              </div>
            );
          })
      )}

      {displayMode === "groups" && (
        groupChats.map((groupChat) => (
          <div
            className="userChat"
            key={groupChat.groupName} // Adjust key according to your data
            onClick={() => handleSelect(groupChat)}
          >
            <div className="userChat">
              <span> {groupChat.groupName} </span>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Chats;
