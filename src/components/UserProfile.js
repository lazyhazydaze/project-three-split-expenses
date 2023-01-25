import React, { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Container,
  Grid,
  Typography,
  CardHeader,
  TextField,
} from "@mui/material";

export const UserProfile = (props) => {
  const [values, setValues] = useState({
    name: props.currentUser.name,
    email: props.currentUser.email,
  });

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8,
      }}
    >
      <Container maxWidth="lg">
        <Typography sx={{ mb: 3 }} variant="h4">
          Account
        </Typography>
        <Grid container spacing={3}>
          <Grid item lg={4} md={6} xs={12}>
            <Card>
              <CardContent>
                <Box
                  sx={{
                    alignItems: "center",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Avatar
                    src={props.currentUser.picture}
                    sx={{
                      height: 64,
                      mb: 2,
                      width: 64,
                    }}
                  />
                  <Typography color="textPrimary" gutterBottom variant="h5">
                    {props.currentUser.name}
                  </Typography>
                  <Typography color="textSecondary" variant="body2">
                    {props.currentUser.email}
                  </Typography>
                </Box>
              </CardContent>
              <Divider />
              <CardActions>
                <Button disabled color="primary" fullWidth variant="text">
                  Upload picture
                </Button>
              </CardActions>
            </Card>
          </Grid>
          <Grid item lg={8} md={6} xs={12}>
            <form autoComplete="off" noValidate>
              <Card>
                <CardHeader
                  subheader="The information can be edited"
                  title="Profile"
                />
                <CardContent>
                  <Grid container spacing={3}>
                    <Grid item md={6} xs={12}>
                      <TextField
                        fullWidth
                        label="Name"
                        name="name"
                        onChange={handleChange}
                        required
                        value={values.name}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item md={6} xs={12}>
                      <TextField
                        disabled
                        fullWidth
                        label="Email Address"
                        name="email"
                        onChange={handleChange}
                        required
                        value={values.email}
                        variant="outlined"
                      />
                    </Grid>
                  </Grid>
                </CardContent>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    p: 2,
                  }}
                >
                  <Button disabled color="primary" variant="contained">
                    Save details
                  </Button>
                </Box>
              </Card>
            </form>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};
