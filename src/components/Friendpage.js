import { DataObjectSharp } from "@mui/icons-material";
import { onAuthStateChanged } from "firebase/auth";
import { child, get, update, ref, onValue, set } from "firebase/database";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { database, auth, dbRef } from "../firebase";
import "./Friendpage.css";

export const Friendpage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(auth ? auth.currentUser : ""); // this fixes the refresh issue but breaks the friend request display

  // const user = auth.currentUser           // shits weird, refresh breaks it, going back to homepage fixes it

  // const user = useContext(UserContext)    //works but breaks on refresh

  // const user = auth.currentUser

  const addfriendwindow = useRef();
  // const [friendName, setFriendName] = useState("")
  const [friendID, setFriendID] = useState("");

  const openAddFriendMenu = () => {
    //more userefs
    const addfriendwindowref = addfriendwindow.current;
    addfriendwindowref.classList.add("display");
  };

  const closeAddFriendMenu = () => {
    const addfriendwindowref = addfriendwindow.current;
    addfriendwindowref.classList.remove("display");
  };

  const sendFriendRequest = (e) => {
    e.preventDefault();

    get(child(dbRef, `users`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          console.log("snapshot all users", snapshot.val());
          //need to add input validation to check if friend exists (snapshot.val() lists all users on database, can filter it to find friendID)
          let listOfUserObject = snapshot.val();
          let doesExist = false;
          for (const [UID, userObject] of Object.entries(listOfUserObject)) {
            if (doesExist) {
              break;
            }
            if (!doesExist && userObject.email === friendID) {
              if (!doesExist && "currentFriends" in userObject) {
                let currentFriendsList = [...userObject.currentFriends];
                currentFriendsList.every((currentFriend) => {
                  if (user.email === currentFriend.value) {
                    alert("alr added as friend");
                    doesExist = true;
                    return false;
                  }
                });
              }
              if (!doesExist && "friendRequestFrom" in userObject) {
                let oldFriendRequestFrom = [...userObject.friendRequestFrom];
                if (oldFriendRequestFrom.includes(user.uid)) {
                  //friend alr exist
                  alert("friend req alr sent");
                  doesExist = true;
                } else {
                  const updates = {};
                  updates[`users/${UID}/friendRequestFrom`] = [
                    ...userObject.friendRequestFrom,
                    user.uid,
                  ];
                  update(ref(database), updates);
                  alert("friend req sent");
                  doesExist = true;
                }
              } else if (!doesExist) {
                const updates = {};
                updates[`friendRequestFrom`] = [user.uid];
                update(ref(database, `users/${UID}`), updates);
                alert("friend req sent");
                doesExist = true;
              }
            }
          }
          if (!doesExist) alert("user not in database");
          console.log("No data avail");
        }
      })
      .then(() => {
        setFriendID("");
        closeAddFriendMenu();
      });
  };

  const [numberOfRequests, setNumberOfRequests] = useState(0);
  const [requestList, setRequestList] = useState([]);
  const [requestListUsernames, setRequestListUsernames] = useState([]);

  const getCurrentFriendRequests = () => {
    // const requestsRef = dbRef(database, "users/" + user.uid + "/" + "friendRequestFrom")
    // onValue(requestsRef, (snapshot) => {
    //     console.log(snapshot.val())
    //     setRequestList(snapshot.val())
    //     setNumberOfRequests(snapshot.val().length)
    // })
    if (user == null) return;
    get(child(dbRef, `users/${user.uid}/friendRequestFrom`)) //why is this breaking????? i want the below code
      .then((snapshot) => {
        if (snapshot.val() != null) {
          console.log("snap", snapshot.val());
          setRequestList(snapshot.val());

          setNumberOfRequests(snapshot.val().length);
        }
      });
    // .then(()=>{
    //     console.log("requestlist",requestList)
    //     requestList.forEach((uid)=>{
    //         get(child(dbRef, `users/${uid}/username`))
    //             .then((username) =>{
    //                 console.log("username",username)
    //                 setRequestListUsernames([...requestListUsernames].push(username))
    //             })
    //     })
    // })
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(auth.currentUser);
      } else {
        navigate("/Login");
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    getCurrentFriendRequests();
  }, [user]);

  useEffect(() => {
    if (requestList == null) return;

    let newarr = [];
    requestList.forEach(async (uid, index) => {
      await get(child(dbRef, `users/${uid}/username`)).then((username) => {
        newarr = [...newarr, username.val()];
        if (index === requestList.length - 1) {
          console.log("newarr", newarr);
          setRequestListUsernames(newarr);
        }
      });
    });
  }, [requestList]);

  const acceptfriendwindow = useRef();
  const openAcceptRequestWindow = () => {
    const acceptfriendwindowref = acceptfriendwindow.current;
    acceptfriendwindowref.classList.add("display");
  };
  const closeAcceptRequestWindow = () => {
    const acceptfriendwindowref = acceptfriendwindow.current;
    acceptfriendwindowref.classList.remove("display");
  };

  const acceptFriendRequest = (username, index) => {
    //delete pendingfriendreqeuest array
    //create new friendswith array
    //access database once and do both at same time?

    //get uid from username
    const thisfriendid = requestList[index];
    console.log("thisfriendid", thisfriendid);

    get(child(dbRef, `users/${user.uid}/friendRequestFrom`))
      .then((snapshot) => {
        //delete the pending friend request
        console.log("accept", snapshot.val());
        const newarr = snapshot.val().filter((x) => x !== thisfriendid); //change username to friend id
        console.log("username", username);
        console.log("filter newarr", newarr);
        return newarr;
      })
      .then((newarr) => {
        // set(ref(database,`users/${user.uid}`),{ // more testing needs to be done on update or set
        //     friendRequestFrom : newarr
        // })
        const updates = {};
        updates[`users/${user.uid}/friendRequestFrom`] = [newarr];
        update(ref(database), updates);
        // updates[]
      });

    let friendEmail = "";
    get(child(dbRef, `users/${thisfriendid}/email`))
      .then((snapshot) => {
        friendEmail = snapshot.val();
      })
      .then(() => {
        get(child(dbRef, `users/${user.uid}/currentFriends`)).then(
          (snapshot) => {
            //add sender to recepient friend list
            if (snapshot.val() == null) {
              const updates = {};
              updates[`users/${user.uid}/currentFriends`] = [
                { value: friendEmail, label: username },
              ];
              update(ref(database), updates);
            } else {
              // if exist, then append
              const updates = {};
              updates[`users/${user.uid}/currentFriends`] = [
                ...snapshot.val(),
                { value: friendEmail, label: username },
              ];
              update(ref(database), updates);
            }
          }
        );
      })
      .then(() => {
        get(child(dbRef, `users/${thisfriendid}/currentFriends`)).then(
          (snapshot) => {
            //add recipient to sender
            if (snapshot.val() == null) {
              const updates = {};
              updates[`users/${thisfriendid}/currentFriends`] = [
                { value: user.email, label: user.displayName },
              ];
              update(ref(database), updates);
            } else {
              const updates = {};
              updates[`users/${thisfriendid}/currentFriends`] = [
                ...snapshot.val(),
                { value: user.email, label: user.displayName },
              ];
              update(ref(database), updates);
            }
          }
        );
      });

    closeAcceptRequestWindow();
    //remove map from page
  };

  const rejectFriendRequest = (username, index) => {
    const thisfriendid = requestList[index];

    get(child(dbRef, `users/${user.uid}/friendRequestFrom`))
      .then((snapshot) => {
        //delete the pending friend request
        console.log("accept", snapshot.val());
        const newarr = snapshot.val().filter((x) => x !== thisfriendid); //change username to friend id
        console.log("username", username);
        console.log("filter newarr", newarr);
        return newarr;
      })
      .then((newarr) => {
        // set(ref(database,`users/${user.uid}`),{ // more testing needs to be done on update or set
        //     friendRequestFrom : newarr
        // })
        const updates = {};
        updates[`users/${user.uid}/friendRequestFrom`] = [newarr];
        update(ref(database), updates);
        // updates[]
      });
    closeAcceptRequestWindow();
  };

  return (
    <>
      <div>
        <h2>Friend List</h2>
        <button onClick={openAddFriendMenu}>Add Friend</button>
      </div>

      <div ref={addfriendwindow} className={"addfriend"}>
        Add friend menu
        <span className="close" onClick={closeAddFriendMenu}>
          &times;
        </span>
        <form onSubmit={(e) => sendFriendRequest(e)}>
          <input
            type={"text"}
            onChange={(e) => {
              setFriendID(e.target.value);
            }}
            placeholder={"enter email to add"}
            value={friendID}
          />
          <input type={"submit"} />
        </form>
      </div>

      <div>
        <h2>Current Friends</h2>

        <span
          onClick={openAcceptRequestWindow}
          className="requests"
        >{`${numberOfRequests} new requests`}</span>
      </div>

      <div ref={acceptfriendwindow} className={"acceptfriend"}>
        <div className="acceptfriend-content">
          Friend Requests
          <span className="close" onClick={closeAcceptRequestWindow}>
            &times;
          </span>
          {/* map the friend requests use jsx */}
          {/* {console.log("List",requestListUsernames)}
                    {console.log("reqlist",requestList)} */}
          {requestList.length > 0 ? (
            requestListUsernames.map((username, index) => {
              return (
                <div key={index} style={{ position: "relative" }}>
                  {/* {console.log("key",)} */}
                  <div className="crosstick-herder">
                    <span>{`${username}`}</span>
                    <div>
                      <span
                        className="tick"
                        onClick={() => acceptFriendRequest(username, index)}
                      >
                        &#x2713;
                      </span>
                      <span
                        className="cross"
                        onClick={() => rejectFriendRequest(username, index)}
                      >
                        &#x2717;
                      </span>
                    </div>
                  </div>
                </div>
              ); // fix this css slowly tmr i want sleep early
            })
          ) : (
            <p>no friend requests</p>
          )}
        </div>
      </div>
    </>
  );
};
