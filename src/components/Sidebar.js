import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Divider,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { Link, Outlet } from "react-router-dom";
import axios from "axios";

export default function Sidebar(props) {
  const [groupList, setGroupList] = useState([]);

  const helperGrouplist = (arrayofobjects) => {
    let filteredarray = [];
    arrayofobjects.forEach((group) => {
      filteredarray.push({
        groupId: group.id,
        name: group.name,
      });
    });
    return filteredarray;
  };

  const getGroupList = async () => {
    let groups = await axios.get(
      `${process.env.REACT_APP_API_SERVER}/groups/user/${props.currentUser.id}`
    );
    console.log("groups.data: ", helperGrouplist(groups.data.groups));
    setGroupList(helperGrouplist(groups.data.groups));
  };

  useEffect(() => {
    getGroupList();
  }, [props.currentUser]);

  return (
    <div style={{ display: "flex" }}>
      <Box ml={4} mt={8} width={250} minWidth={250}>
        <Box textAlign="center" mb={2}>
          <Button
            variant="contained"
            size="small"
            startIcon={<AddIcon />}
            component={Link}
            to={`/creategroup`}
          >
            New Group
          </Button>
        </Box>

        <Typography variant="subtitle2">Groups</Typography>
        <Divider />

        <Box mt={2}>
          <Typography variant="body2">
            <List>
              {groupList.map((group) => (
                <ListItem disablePadding>
                  <ListItemButton
                    component={Link}
                    to={`/group/${group.groupId}/invoices`}
                  >
                    <ListItemText primary={group.name} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Typography>
        </Box>

        {/* <Box mt={1}>
          <Typography variant="body2" component="span">
            Group 2 here
          </Typography>
        </Box> */}

        {/* <Box mt={1} mb={3}></Box> */}

        {/* <Typography variant="subtitle2">Friends</Typography>
        <Divider />

        <Box mt={1}>friends go here</Box> */}
      </Box>

      <Outlet />
    </div>
  );
}
