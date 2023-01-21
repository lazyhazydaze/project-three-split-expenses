import React, { useEffect, useState } from "react";
import {
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Typography,
  ListItemButton,
} from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import axios from "axios";

export default function ReceiptDisplay(props) {
  const [userExpensesData, setUserExpensesData] = useState([]);
  const [open, setOpen] = useState(false);

  // helper function to create an array of splitted amounts spent
  const helperTotalSpent = (arrayofobjects) => {
    let newarray = [];
    arrayofobjects.forEach((object) => {
      newarray.push(object.amount);
    });
    console.log("a newarray:", newarray);
    const initialValue = 0;
    const sum = newarray.reduce(
      (accumulator, currentValue) => Number(accumulator) + Number(currentValue),
      initialValue
    );
    return sum.toFixed(2);
  };

  // axios get from backend each user's expenses in particular invoice
  const getUserExpenses = async () => {
    let response = await axios.get(
      `${process.env.REACT_APP_API_SERVER}/expenses/invoice/${props.invoiceid}/spender/${props.spenderid}`
    );
    console.log("user's expenses per invoice : ", response.data);
    setUserExpensesData(response.data);
  };

  useEffect(() => {
    getUserExpenses();
  }, [props.invoiceid, props.spenderid]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      {userExpensesData && userExpensesData.length > 0 && (
        <div>
          <ListItem onClick={handleClickOpen}>
            <ListItemButton>
              <ListItemText
                primary={userExpensesData[0].splitby.name}
                secondary={userExpensesData[0].splitby.email}
              />
              <ListItemSecondaryAction>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  component="span"
                >
                  ${helperTotalSpent(userExpensesData)}
                </Typography>
              </ListItemSecondaryAction>
            </ListItemButton>
          </ListItem>
          <Dialog open={open} onClose={handleClose}>
            <center>
              <DialogTitle>
                Expenses for {userExpensesData[0].splitby.name}
              </DialogTitle>
            </center>
            <DialogContent>
              <DialogContentText>
                <AcccessibleTable userExpensesData={userExpensesData} />
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Close</Button>
            </DialogActions>
          </Dialog>
        </div>
      )}
    </div>
  );
}

function createData(item, cost) {
  return { item, cost };
}

function AcccessibleTable(props) {
  const rows = props.userExpensesData.map((item) =>
    createData(item.expense.name, Number(item.amount))
  );

  console.log("rows", rows);

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 300 }} aria-label="caption table">
        <TableHead>
          <TableRow>
            <TableCell>Purchase</TableCell>
            <TableCell align="right">Cost&nbsp;($)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow key={index}>
              <TableCell component="th" scope="row">
                {row.item}
              </TableCell>
              <TableCell align="right">{row.cost.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
