import Sidebar from "./Sidebar";
import Header from "./Header";
import { Outlet } from "react-router-dom";
import { AppBar, Box, CssBaseline, Drawer, Toolbar } from "@mui/material";

export default function MainLayout(props) {
  const drawerWidth = 240;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        color="secondary"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Header currentUser={props.currentUser} />
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: "auto" }}>
          <Sidebar
            setForceRefresh={props.setForceRefresh}
            forceRefresh={props.forceRefresh}
            currentUser={props.currentUser}
          />
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {/* <Toolbar /> */}
        <Outlet />
      </Box>
    </Box>
  );
}
