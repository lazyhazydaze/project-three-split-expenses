import { Box, Container, Typography } from "@mui/material";
import Sidebar from "./Sidebar";

export default function Dashboard(props) {
  return (
    <Container sx={{ maxWidth: { xl: 1280 } }}>
      <Box mt={2} display="flex" flexWrap="wrap" width="100%" gap={1}>
        <Sidebar currentUser={props.currentUser} />
        <Box flex="1">
          <Container component="main" sx={{ mt: 8, mb: 2 }} maxWidth="sm">
            <Typography
              sx={{ fontWeight: "bold", color: "#132F4C" }}
              variant="h2"
              component="h1"
              gutterBottom
            >
              Welcome {props.currentUser.name}.
            </Typography>
          </Container>
        </Box>
      </Box>
    </Container>
  );
}


