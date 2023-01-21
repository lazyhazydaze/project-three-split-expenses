import React, { useEffect, useState } from "react";
import axios from "axios";

import "./Friendpage.css";

export function Friendpage(props) {
  // Form field to send friend request with email
  // Display list of accepted requests "friends"
  // Display list of pending requests with option to accept or decline

  const [recipientEmail, setRecipientEmail] = useState("");

  const [friendList, setFriendList] = useState([]);
  const [requestsReceived, setRequestsReceived] = useState([]);
  const [requestsSent, setRequestsSent] = useState([]);

  const helper = (arrayofobjects) => {
    let filteredarray = [];
    arrayofobjects.forEach((object) => {
      if (object.user1.id === props.currentUser.id) {
        filteredarray.push({
          rowId: object.id,
          friendId: object.user2.id,
          name: object.user2.name,
          email: object.user2.email,
        });
      } else {
        filteredarray.push({
          rowId: object.id,
          friendId: object.user1.id,
          name: object.user1.name,
          email: object.user1.email,
        });
      }
    });
    return filteredarray;
  };

  const getFriendList = async () => {
    let friends = await axios.get(
      `${process.env.REACT_APP_API_SERVER}/friends/user/${props.currentUser.id}`
    );
    console.log("friendList: ", helper(friends.data));
    setFriendList(helper(friends.data));
  };

  const getReceivedRequests = async () => {
    let pendingRequests = await axios.get(
      `${process.env.REACT_APP_API_SERVER}/friends/requests-received/recipient/${props.currentUser.id}`
    );
    console.log("receivedRequests.data: ", pendingRequests.data);
    setRequestsReceived(pendingRequests.data);
  };

  const getSentRequests = async () => {
    let pendingRequests = await axios.get(
      `${process.env.REACT_APP_API_SERVER}/friends/requests-sent/sender/${props.currentUser.id}`
    );
    console.log("sentRequests.data: ", pendingRequests.data);
    setRequestsSent(pendingRequests.data);
  };

  useEffect(() => {
    getReceivedRequests();
    getSentRequests();
    getFriendList();
  }, [props.currentUser]);

  const sendFriendRequest = async (e) => {
    e.preventDefault();
    await axios
      .post(`${process.env.REACT_APP_API_SERVER}/friends`, {
        sender_id: props.currentUser.id,
        recipient_email: recipientEmail,
      })
      .then((response) => {
        console.log(response.data);
        setRecipientEmail("");
        getSentRequests();
      });
  };

  const acceptRequest = async (tableId) => {
    await axios
      .post(
        `${process.env.REACT_APP_API_SERVER}/friends/requests-accept/table/${tableId}`
      )
      .then((response) => {
        console.log(response.data);
        getReceivedRequests();
        getSentRequests();
        getFriendList();
      });
  };

  const rejectRequest = async (tableId) => {
    await axios
      .delete(
        `${process.env.REACT_APP_API_SERVER}/friends/requests-delete/table/${tableId}`
      )
      .then((response) => {
        console.log(response.data);
        getReceivedRequests();
        getSentRequests();
        getFriendList();
      });
  };

  const deleteCurrentFriend = async (tableId) => {
    await axios
      .delete(
        `${process.env.REACT_APP_API_SERVER}/friends/friends-delete/table/${tableId}`
      )
      .then((response) => {
        console.log(response.data);
        getFriendList();
      });
  };

  return (
    <div>
      Add Friend:{" "}
      <input
        type="text"
        placeholder="Email here"
        value={recipientEmail}
        onChange={(e) => setRecipientEmail(e.target.value)}
      />
      <button onClick={sendFriendRequest}>Send</button>
      <h1>My Friends:</h1>
      {friendList.length > 0 &&
        friendList.map((friend) => (
          <div key={friend.friendId}>
            <p>
              {friend.name}---{friend.email}{" "}
              <button onClick={() => deleteCurrentFriend(friend.rowId)}>
                Delete friend
              </button>
            </p>
          </div>
        ))}
      <h1>Requests received from:</h1>
      {requestsReceived.map((request) => (
        <div key={request.id}>
          <p>
            {request.sender.name}---{request.sender.email}{" "}
            <button onClick={() => acceptRequest(request.id)}>Accept</button>
            <button onClick={() => rejectRequest(request.id)}>Reject</button>
          </p>
        </div>
      ))}
      <h1>Requests sent to:</h1>
      {requestsSent.map((request) => (
        <div key={request.id}>
          <p>
            {request.recipient.name}---{request.recipient.email}{" "}
            <button onClick={() => rejectRequest(request.id)}>Delete</button>
          </p>
        </div>
      ))}
    </div>
  );
}
