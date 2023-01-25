import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Container, Typography } from "@mui/material";

export default function Dashboard(props) {
  const [userTotalAmount, setUserTotalAmount] = useState(0);

  const getUserDebtTotal = async () => {
    let response = await axios.get(
      `${process.env.REACT_APP_API_SERVER}/expenses/user/${props.currentUser.id}`
    );
    console.log("user debt: ", response.data);
    setUserTotalAmount(response.data);
  };

  useEffect(() => {
    getUserDebtTotal();
  }, [props.currentUser]);

  // if amount < 0 ? red : (if amount == 0 ? purple : green )

  return (
    <Container sx={{ maxWidth: { xl: 1280 } }}>
      <Container component="main" sx={{ mt: 8, mb: 2 }} maxWidth="sm">
        <Typography
          display="inline"
          sx={{ fontWeight: "bold", color: "#132F4C" }}
          variant="h2"
          component="h1"
          gutterBottom
        >
          Welcome{" "}
        </Typography>
        <Typography
          display="inline"
          sx={{ fontWeight: "bold", color: "#007FFF" }}
          variant="h2"
          component="h1"
          gutterBottom
        >
          {props.currentUser.name}.
        </Typography>
      </Container>
      <Container maxWidth="sm" sx={{ mb: 4 }}>
        {userTotalAmount < 0 ? (
          <Card
            sx={{
              py: 5,
              boxShadow: 3,
              textAlign: "center",
              color: "#C62828",
              bgcolor: "#EF9A9A",
            }}
          >
            <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
              You owe
            </Typography>
            <Typography variant="h3">
              ${Math.abs(userTotalAmount).toFixed(2)}
            </Typography>
            <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
              in total
            </Typography>
          </Card>
        ) : userTotalAmount === 0 ? (
          <Card
            sx={{
              py: 5,
              boxShadow: 3,
              textAlign: "center",
              color: "#5E35B1",
              bgcolor: "#EDE7F6",
            }}
          >
            <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
              You owe/ are owed
            </Typography>
            <Typography variant="h3">${userTotalAmount.toFixed(2)}</Typography>
            <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
              (All settled 🎉)
            </Typography>
          </Card>
        ) : (
          <Card
            sx={{
              py: 5,
              boxShadow: 3,
              textAlign: "center",
              color: "#00C853",
              bgcolor: "#B9F6CA",
            }}
          >
            <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
              You are owed
            </Typography>
            <Typography variant="h3">${userTotalAmount.toFixed(2)}</Typography>
            <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
              in total
            </Typography>
          </Card>
        )}
      </Container>
    </Container>
  );
}
