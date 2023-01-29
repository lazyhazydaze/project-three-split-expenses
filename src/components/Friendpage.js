import React, { useEffect, useState } from "react";
import axios from "axios";
import Avatar from "@mui/material/Avatar";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import SendIcon from "@mui/icons-material/Send";

import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  OutlinedInput,
  Snackbar,
  Typography,
} from "@mui/material";

const TrashIcon = (props) => {
  const [clearOpen, setClearOpen] = useState(false);

  return (
    <span>
      <IconButton
        onClick={() => {
          setClearOpen(true);
        }}
        aria-label="delete"
        size="small"
      >
        <DeleteIcon fontSize="small" />
      </IconButton>

      <Dialog
        open={clearOpen}
        onClose={() => {
          setClearOpen(false);
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm delete?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure? This action is irreversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setClearOpen(false);
            }}
          >
            No
          </Button>
          <Button
            onClick={() => {
              setClearOpen(false);
              props.deleteFunction(props.friendid);
            }}
            autoFocus
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </span>
  );
};

export function Friendpage(props) {
  // Form field to send friend request with email
  // Display list of accepted requests "friends"
  // Display list of pending requests with option to accept or decline

  const [recipientEmail, setRecipientEmail] = useState("");

  const [friendList, setFriendList] = useState([]);
  const [requestsReceived, setRequestsReceived] = useState([]);
  const [requestsSent, setRequestsSent] = useState([]);

  const [successAlert, setSuccessAlert] = useState(false);
  const [errorAlert, setErrorAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleCloseAlert = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setErrorAlert(false);
    setSuccessAlert(false);
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
          picture: object.user2.picture,
        });
      } else {
        filteredarray.push({
          rowId: object.id,
          friendId: object.user1.id,
          name: object.user1.name,
          email: object.user1.email,
          picture: object.user1.picture,
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
        console.log("send success response.data: ", response.data);
        setRecipientEmail("");
        getSentRequests();
        setSuccessAlert(true);
      })
      .catch((error) => {
        console.log("send error response data: ", error.response.data.msg);
        setErrorAlert(true);
        setErrorMessage(error.response.data.msg);
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
      <Container disableGutters>
        <Box
          sx={{
            width: "auto",
            my: 4,
            height: 100,
          }}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <OutlinedInput
            sx={{ color: "primary.main" }}
            value={recipientEmail}
            onChange={(e) => setRecipientEmail(e.target.value)}
            startAdornment={
              <InputAdornment position="start">
                <MailOutlineIcon />
              </InputAdornment>
            }
          />

          <IconButton onClick={sendFriendRequest}>
            <SendIcon color="primary" />
          </IconButton>
          <Snackbar
            open={successAlert}
            autoHideDuration={2000}
            onClose={handleCloseAlert}
          >
            <Alert
              onClose={handleCloseAlert}
              severity="success"
              sx={{ width: "100%" }}
            >
              <AlertTitle>Success</AlertTitle>
              Friend request sent.
            </Alert>
          </Snackbar>
          <Snackbar
            open={errorAlert}
            autoHideDuration={2000}
            onClose={handleCloseAlert}
          >
            <Alert
              onClose={handleCloseAlert}
              severity="error"
              sx={{ width: "100%" }}
            >
              <AlertTitle>Error</AlertTitle>
              {errorMessage}
            </Alert>
          </Snackbar>
          <br />
        </Box>

        <Grid
          container
          justifyContent="space-evenly"
          alignItems="stretch"
          spacing={3}
        >
          <Grid item lg={4} md={8} sm={6} xs={12}>
            <Card>
              <CardContent>
                <CardHeader
                  title={
                    <Typography variant="h5">
                      Friends ({friendList.length > 0 ? friendList.length : 0}){" "}
                    </Typography>
                  }
                />
                {friendList.length > 0 && (
                  <List>
                    {friendList.map((friend) => (
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar alt="pfp" src={friend.picture} />
                        </ListItemAvatar>
                        <ListItemText
                          primary={`${friend.name}`}
                          secondary={<>{friend.email}</>}
                        />
                        <ListItemSecondaryAction>
                          <ListItemIcon>
                            <TrashIcon
                              deleteFunction={deleteCurrentFriend}
                              friendid={friend.rowId}
                            />
                          </ListItemIcon>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid item lg={4} md={12} sm={12} xs={12}>
            <Grid container spacing={3}>
              <Grid item sm={6} xs={12} md={4} lg={12}>
                <Card>
                  <CardContent>
                    <CardHeader
                      title={
                        <Typography variant="h5">
                          Pending requests (
                          {requestsReceived.length > 0
                            ? requestsReceived.length
                            : 0}
                          )
                        </Typography>
                      }
                    />
                    <List>
                      {requestsReceived.map((request) => (
                        <ListItem>
                          <ListItemAvatar>
                            <Avatar alt="pfp" src={request.sender.picture} />
                          </ListItemAvatar>
                          <ListItemText
                            primary={`${request.sender.name}`}
                            secondary={<>{request.sender.email}</>}
                          />
                          <ListItemSecondaryAction>
                            <ListItemIcon>
                              <IconButton>
                                <CheckCircleOutlineOutlinedIcon
                                  sx={{ color: "success.main" }}
                                  onClick={() => acceptRequest(request.id)}
                                />
                              </IconButton>
                              <IconButton>
                                <CancelOutlinedIcon
                                  sx={{ color: "error.main" }}
                                  onClick={() => rejectRequest(request.id)}
                                />
                              </IconButton>
                            </ListItemIcon>
                          </ListItemSecondaryAction>
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item sm={6} xs={12} md={4} lg={12}>
                <Card>
                  <CardContent>
                    <CardHeader
                      title={
                        <Typography variant="h5">
                          Sent requests (
                          {requestsSent.length > 0 ? requestsSent.length : 0})
                        </Typography>
                      }
                    />
                    <List>
                      {requestsSent.map((request) => (
                        <ListItem>
                          <ListItemAvatar>
                            <Avatar alt="pfp" src={request.recipient.picture} />
                          </ListItemAvatar>
                          <ListItemText
                            primary={`${request.recipient.name}`}
                            secondary={<>{request.recipient.email}</>}
                          />
                          <ListItemSecondaryAction>
                            <ListItemIcon>
                              <TrashIcon
                                deleteFunction={rejectRequest}
                                friendid={request.id}
                              />
                            </ListItemIcon>
                          </ListItemSecondaryAction>
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}
