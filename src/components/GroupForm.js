import React, { useEffect, useState } from "react";
import axios from "axios";

export default function GroupForm(props) {
  // Textfield for group name
  // Add group members
  // Save button
  const [friendList, setFriendList] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([{ name: "", email: "" }]);
  const [groupNameField, setGroupNameField] = useState("");

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
    console.log("friendlist.data: ", friends.data);
    setFriendList(helper(friends.data));
  };

  useEffect(() => {
    getFriendList();
  }, [props.currentUser]);

  const handleFormChange = (event, index) => {
    let data = [...selectedUsers];
    data[index][event.target.name] = event.target.value;
    setSelectedUsers(data);
  };

  const createNewGroup = async (name, users) => {
    // create an array of group members ids
    const userIdsArray = users.map(({ email }) => {
      for (let i = 0; i < friendList.length; i++) {
        // what are some other ways of iterating?
        if (friendList[i].email === email) {
          return friendList[i].friendId;
        }
      }
    });
    let selectedUserIds = [props.currentUser.id, ...userIdsArray];
    let group = {
      name,
      selectedUserIds,
    };
    let response = await axios.post(
      `${process.env.REACT_APP_API_SERVER}/groups`,
      group
    );
    console.log("create group response", response.data);
  };

  const submit = (e) => {
    e.preventDefault();
    createNewGroup(groupNameField, selectedUsers);
    // console.log("selectedUsers", selectedUsers);
    // console.log("groupname is: ", groupNameField);
    setGroupNameField("");
    setSelectedUsers([{ name: "", email: "" }]);
  };

  const addFields = () => {
    let object = {
      name: "",
      email: "",
    };

    setSelectedUsers([...selectedUsers, object]);
  };

  const removeFields = (index) => {
    let data = [...selectedUsers];
    data.splice(index, 1);
    setSelectedUsers(data);
  };

  return (
    <div>
      <h1>Start A New Group</h1>
      <h4>This group is called...</h4>
      <input
        name="groupname"
        placeholder="Group name..."
        onChange={({ target }) => setGroupNameField(target.value)}
        value={groupNameField}
      />{" "}
      <br />
      <br />
      <h4>Group members</h4>
      {selectedUsers.map((form, index) => {
        return (
          <div key={index}>
            <input
              name="name"
              placeholder="Name"
              onChange={(event) => handleFormChange(event, index)}
              value={form.name}
            />
            <input
              name="email"
              placeholder="Email"
              onChange={(event) => handleFormChange(event, index)}
              value={form.email}
            />
            <button onClick={() => removeFields(index)}>Remove</button>
          </div>
        );
      })}
      <button onClick={addFields}>Add More</button>
      <br />
      <br />
      <button onClick={submit}>Save</button>
    </div>
  );
}
