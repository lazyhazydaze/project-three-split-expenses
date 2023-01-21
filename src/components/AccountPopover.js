import React, { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
//import { auth } from "../firebase";
//import { signOut } from "firebase/auth";
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

export default function AccountPopover(props) {
  const { logout, user, isAuthenticated } = useAuth0();

  const [open, setOpen] = useState(null);

  const navigate = useNavigate();

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleLogout = () => {
    setOpen(null);
    logout({ returnTo: window.location.origin });
  };

  // === for firebase ===
  // const handleLogout = () => {
  //   setOpen(null);
  //   signOut(auth)
  //     .then(() => {
  //       navigate("/Login");
  //     })
  //     .catch((error) => {
  //       console.log("sign out fail", error);
  //     });
  // };

  const handleClose = () => {
    setOpen(null);
    navigate("/userprofile");
  };

  const MENU_OPTIONS = [
    {
      label: "Profile Page",
      action: handleClose,
    },
    {
      label: "Logout",
      action: handleLogout,
    },
  ];

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
        <Avatar src={props.pfp} alt="photoURL" />
      </IconButton>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={() => setOpen(null)}
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
            {/* {props.displayName} */}
            {isAuthenticated && user.nickname}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }} noWrap>
            {/* {props.email} */}
            {isAuthenticated && user.email}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: "dashed" }} />

        <Stack sx={{ p: 1 }}>
          {MENU_OPTIONS.map((option) => (
            <MenuItem key={option.label} onClick={option.action}>
              {option.label}
            </MenuItem>
          ))}
        </Stack>
      </Popover>
    </>
  );
}
