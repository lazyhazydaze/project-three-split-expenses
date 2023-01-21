import React from "react";
import {
  Tabs,
  Tab,
  Toolbar,
  AppBar,
  Box,
  Typography,
  Stack,
} from "@mui/material";
import { Outlet, Link, matchPath, useLocation } from "react-router-dom";
import AccountPopover from "./AccountPopover";
import Logo from "../lightning.png";

export default function Header(props) {
  const location = useLocation();

  let currentPath = "/dashboard";
  if (!!matchPath("/contacts/*", location.pathname)) {
    currentPath = "/contacts";
  } else if (!!matchPath("/dashboard/*", location.pathname)) {
    currentPath = "/dashboard";
  }

  return (
    <div>
      <Box component="nav" sx={{ flexGrow: 1 }}>
        <AppBar position="static" color="primary">
          <Toolbar variant="dense">
            <Box flex={1} display="flex" justifyContent="space-between">
              <Box display="flex" alignItems="center">
                <Box
                  component="img"
                  sx={{ marginRight: "1em", height: 30 }}
                  src={Logo}
                  alt="Header Logo"
                />
                <Typography component="span" variant="h5">
                  Split & Settle
                </Typography>
              </Box>
              <Box>
                <Tabs
                  value={currentPath}
                  aria-label="Navigation Tabs"
                  indicatorColor="secondary"
                  textColor="inherit"
                >
                  {/* <Tab label={"Homepage"} component={Link} to="/" value="/" /> */}

                  {/* <Tab
                    label={"Invoices"}
                    component={Link}
                    to="/invoices"
                    value="/invoices"
                  /> */}
                  <Tab
                    label={"Dashboard"}
                    component={Link}
                    to="/dashboard"
                    value="/dashboard"
                  />
                  <Tab
                    label={"Contacts"}
                    component={Link}
                    to="/contacts"
                    value="/contacts"
                  />
                </Tabs>
              </Box>
              <Box display="flex">
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={{
                    xs: 0.5,
                    sm: 1,
                  }}
                >
                  <AccountPopover
                    displayName={props.currentUser.name}
                    email={props.currentUser.email}
                    pfp={props.currentUser.picture}
                  />
                </Stack>
              </Box>
            </Box>
          </Toolbar>
        </AppBar>
      </Box>

      <Outlet />
    </div>
  );
}
