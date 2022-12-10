import React, { useState } from "react";
// @mui
import { alpha } from "@mui/material/styles";
import {
  Box,
  Divider,
  Typography,
  Stack,
  MenuItem,
  Avatar,
  IconButton,
  Popover,
} from "@mui/material";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";

// ----------------------------------------------------------------------
const account = {
  displayName: "Hazelle Lim",
  email: "hazelle@email.com",
  photoURL: "/assets/images/avatars/avatar_default.jpg",
};

const MENU_OPTIONS = [
  {
    label: "Edit Profile",
  },
  {
    label: "Logout",
  },
];

// ----------------------------------------------------------------------


export default function AccountPopover(props) {
  
  const [open, setOpen] = useState(null);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const navigate = useNavigate()
  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        // unsubAuthStateChanged()
        navigate("/Login");
      })
      .catch((error) => {
        console.log("sign out fail", error);
      });
  };

  const openProfilePage = () => {
    navigate("/userprofile")
  }

  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          p: 0,
          ...(open && {
            "&:before": {
              zIndex: 1,
              content: "''",
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              position: "absolute",
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
            },
          }),
        }}
      >
        <Avatar src={account.photoURL} alt="photoURL" />
      </IconButton>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: {
            p: 0,
            mt: 1.5,
            ml: 0.75,
            width: 180,
            "& .MuiMenuItem-root": {
              typography: "body2",
              borderRadius: 0.75,
            },
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle2" noWrap>
            {props.displayName}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }} noWrap>
            {props.email}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: "dashed" }} />

        <Stack sx={{ p: 1 }}>
          {/* {MENU_OPTIONS.map((option) => (
            <MenuItem key={option.label} onClick={()=>{handleClose();dummyhandle()}}>
              {console.log(option)}
              {option.label}
            </MenuItem>
          ))} */}
          <MenuItem key={"Profile-page"} onClick={()=>{handleClose();openProfilePage()}}>
              Profile Page
          </MenuItem>
          <MenuItem key={"Logout"} onClick={()=>{handleClose();handleLogout()}}>
              Logout
          </MenuItem>
        </Stack>
      </Popover>
    </>
  );
}
