import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Divider,
  Paper,
  TextField,
  Typography,
  IconButton,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import UseAutocomplete from "./GroupFormField";

export default function GroupForm(props) {
  // Textfield for group name
  // Add group members
  // Save button
  const [friendList, setFriendList] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [groupNameField, setGroupNameField] = useState("");
  const [titleError, setTitleError] = useState(true);
  const [titleErrorMessage, setTitleErrorMessage] = useState(
    "Field cannot be blank."
  );

  const validateTitle = (titleValue) => {
    if (titleValue === "") {
      setTitleError(true);
      setTitleErrorMessage("Field cannot be blank.");
    } else if (titleValue.length > 30) {
      setTitleError(true);
      setTitleErrorMessage(
        `Max 30 char (Current: ${titleValue.length} char). `
      );
    } else {
      setTitleError(false);
    }
    setGroupNameField(titleValue);
  };

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
    console.log("friendlist.data: ", helper(friends.data));
    setFriendList(helper(friends.data));
  };

  useEffect(() => {
    getFriendList();
  }, [props.currentUser]);

  const handleFormChange = (value, index) => {
    let data = [...selectedUsers];
    if (value) {
      // if valid, make value show in text box
      data[index] = value;
    } else {
      // if not valid, initialise back to empty
      data[index] = { email: "" };
    }
    //data[index][event.target.name] = value;
    console.log(value);
    console.log("selectedusers data:", data);
    setSelectedUsers(data);
  };

  const createNewGroup = async (name, users) => {
    // create an array of group members ids
    const userIdsArray = users.map(({ friendId }) => {
      return friendId ? friendId : -1;
    });

    console.log("japanese goblin", userIdsArray);
    if (userIdsArray.filter((x) => x === -1).length === 0) {
      let selectedUserIds = [props.currentUser.id, ...userIdsArray];
      let group = {
        name,
        selectedUserIds,
      };
      await axios
        .post(`${process.env.REACT_APP_API_SERVER}/groups`, group)
        .then((response) => {
          props.setForceRefresh(true);
          setGroupNameField("");
          setSelectedUsers([{ name: "", email: "" }]);
          console.log("create group response", response.data);
        });
    } else {
      alert("error adding group");
    }
  };

  const submit = (e) => {
    e.preventDefault();
    if (!titleError) createNewGroup(groupNameField, selectedUsers);
    // console.log("selectedUsers", selectedUsers);
    // console.log("groupname is: ", groupNameField);
  };

  const addFields = () => {
    let object = {
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
      <Container maxWidth="sm" sx={{ mb: 4 }}>
        <Paper
          variant="outlined"
          sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}
        >
          <Typography component="h1" variant="h4" align="center" gutterBottom>
            + New Group
          </Typography>
          <br />
          <Typography
            sx={{ color: "text.secondary" }}
            variant="button"
            display="block"
            gutterBottom
          >
            THIS GROUP IS CALLED...
          </Typography>

          <TextField
            required
            label="Group Title"
            value={groupNameField}
            onChange={({ target }) => validateTitle(target.value)}
            error={titleError}
            helperText={titleError && titleErrorMessage}
            variant="filled"
            size="small"
          />
          <br />
          <br />
          <Divider light />
          <br />

          <Typography
            sx={{ color: "text.secondary" }}
            variant="button"
            display="block"
            gutterBottom
          >
            GROUP MEMBERS
          </Typography>
          <Typography
            sx={{ fontStyle: "oblique" }}
            variant="body2"
            gutterBottom
          >
            {props.currentUser.name} ({props.currentUser.email})
          </Typography>
          {selectedUsers.map((form, index) => {
            return (
              <div key={index} style={{ display: "flex" }}>
                <UseAutocomplete
                  optionlist={friendList}
                  onChange={handleFormChange}
                  value={form}
                  index={index}
                />
                <IconButton size="small" onClick={() => removeFields(index)}>
                  <CloseIcon sx={{ color: "error.main" }} fontSize="small" />
                </IconButton>
              </div>
            );
          })}
          <Button onClick={addFields} size="small">
            + Add a person
          </Button>
          <br />
          <br />
          <Divider light />
          <br />
          <Button onClick={submit} variant="contained" size="large">
            Save
          </Button>
        </Paper>
      </Container>
    </div>
  );
}
