import React, { useEffect, useState } from "react";
import {
  Box,
  Divider,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import GroupsIcon from "@mui/icons-material/Groups";
import { Link } from "react-router-dom";
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
    props.setForceRefresh(false);
  }, [props.currentUser, props.forceRefresh]);

  return (
    <div>
      <Box textAlign="center" mt={1} mb={3}>
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

      <Divider />
      <List subheader={<ListSubheader>Groups</ListSubheader>}>
        {groupList.length > 0 ? (
          groupList.map((group) => (
            <ListItem key={group.groupId} disablePadding>
              <ListItemButton
                component={Link}
                to={`/group/${group.groupId}/invoices`}
              >
                <ListItemIcon>
                  <GroupsIcon />
                </ListItemIcon>
                <ListItemText primary={group.name} />
              </ListItemButton>
            </ListItem>
          ))
        ) : (
          <Box textAlign="center" mt={1} mb={3}>
            <Typography
              color="text.secondary"
              variant="body2"
              display="inline"
              gutterBottom
            >
              Click on{" "}
              <Typography
                color="primary.main"
                variant="button"
                display="inline"
              >
                + New Group
              </Typography>{" "}
              button to begin.
            </Typography>
          </Box>
        )}
      </List>
    </div>
  );
}
