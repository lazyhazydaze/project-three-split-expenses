import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { resolveDebts } from "./DebtFunction";
import {
  Box,
  Button,
  Container,
  Grid,
  Divider,
  Typography,
  Link as MuiLink,
  Toolbar,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function GroupBalance(props) {
  let { groupId } = useParams();
  const [usersInGroup, setUsersInGroup] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [groupBalance, setGroupBalance] = useState({});
  const [eachUserTally, setEachUserTally] = useState("");
  const [debts, setDebts] = useState("");

  function isEmptyObject(obj) {
    return JSON.stringify(obj) === "{}";
  }

  // get all users of selected group

  const getUsersInGroup = async () => {
    let response = await axios.get(
      `${process.env.REACT_APP_API_SERVER}/groups/${groupId}`
    );
    console.log("users in this group: ", response.data);
    setUsersInGroup(response.data.users);
    setGroupName(response.data.name);
  };

  // get the breakdown of each group member's net balance from backend

  const getGroupBalance = async () => {
    // expensesRouter --> getEachGroupExpenses
    let response = await axios.get(
      `${process.env.REACT_APP_API_SERVER}/expenses/group/${groupId}`
    );
    console.log("group balance: ", response.data);
    setGroupBalance(response.data);
  };

  useEffect(() => {
    getGroupBalance();
    getUsersInGroup();
  }, [groupId]);

  useEffect(() => {
    const newtally = {};
    if (!isEmptyObject(groupBalance) && usersInGroup.length > 0) {
      Object.keys(groupBalance).forEach((personidkey) => {
        for (let i = 0; i < usersInGroup.length; i++) {
          if (Number(usersInGroup[i].id) === Number(personidkey)) {
            newtally[usersInGroup[i].name] = Number(
              groupBalance[personidkey]
            ).toFixed(2);
          }
        }
      });
    }
    setEachUserTally(newtally);
    console.log("tally per person:", eachUserTally);
  }, [groupBalance, usersInGroup]);

  useEffect(() => {
    const newObj = {};
    for (let key in eachUserTally) {
      if (Number(eachUserTally[key]) > 0) {
        newObj[key] = {
          tally: `to get $${Number(eachUserTally[key]).toFixed(2)}`,
          owe: [],
        };
      } else {
        newObj[key] = {
          tally: `owes $${Number(Math.abs(eachUserTally[key])).toFixed(2)}`,
          owe: [],
        };
      }
    }
    console.log("a", newObj);
    Object.entries(resolveDebts(eachUserTally)).forEach((array) => {
      for (const key in array[1]) {
        if (Object.keys(newObj).includes(key)) {
          newObj[key]["owe"].push(
            `${key} owes ${array[0]} $${array[1][key].toFixed(2)}`
          );
        }
      }
    });
    console.log("b", newObj);
    setDebts(newObj);
    console.log("c final:", debts);
  }, [groupBalance, usersInGroup]);

  return (
    <>
      <Toolbar />
      <Box
        component="main"
        sx={{
          alignItems: "center",
          display: "flex",
          flexGrow: 1,
          minHeight: "100%",
        }}
      >
        <Container maxWidth="sm">
          <MuiLink
            underline="none"
            component={Link}
            to={`/group/${groupId}/invoices`}
          >
            <Button
              component="a"
              startIcon={<ArrowBackIcon fontSize="small" />}
            >
              Back to Group: {groupName}
            </Button>
          </MuiLink>
          {!isEmptyObject(debts) ? (
            Object.entries(debts).map((record) => {
              return (
                <Box
                  sx={{
                    width: "100%",
                    maxWidth: 400,
                    bgcolor: "background.paper",
                  }}
                >
                  <Box sx={{ my: 3, mx: 2 }}>
                    <Grid container alignItems="center">
                      <Grid item xs>
                        <Typography gutterBottom variant="h4" component="div">
                          {record[0]}
                        </Typography>
                      </Grid>
                      <Grid item>
                        {/* if includes get ? green : (if inclludes  0 ? purple : red ) */}
                        {record[1].tally.includes("get") ? (
                          <Typography
                            sx={{ color: "success.main" }}
                            gutterBottom
                            variant="h6"
                            component="div"
                          >
                            {record[1].tally}
                          </Typography>
                        ) : record[1].tally.includes("$0.00") ? (
                          <Typography
                            sx={{ color: "#5E35B1" }}
                            gutterBottom
                            variant="h6"
                            component="div"
                          >
                            {record[1].tally}
                          </Typography>
                        ) : (
                          <Typography
                            sx={{ color: "error.main" }}
                            gutterBottom
                            variant="h6"
                            component="div"
                          >
                            {record[1].tally}
                          </Typography>
                        )}
                      </Grid>
                    </Grid>
                  </Box>
                  <Box sx={{ m: 2 }}>
                    {record[1].owe.map((debt, index) => (
                      <Typography gutterBottom variant="body1">
                        {debt}
                      </Typography>
                    ))}
                  </Box>
                  <Divider variant="middle" />
                </Box>
              );
            })
          ) : (
            <Typography
              color="text.secondary"
              variant="body2"
              display="block"
              gutterBottom
            >
              <br />
              No records for this group. Go back to create invoices and
              expenses.
            </Typography>
          )}
        </Container>
      </Box>
    </>
  );
}
