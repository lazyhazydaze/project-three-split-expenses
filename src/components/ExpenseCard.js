import React, { useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";

import {
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import axios from "axios";

const getFormattedPrice = (price) => {
  const priceTwoDecimal = Number(price).toFixed(2);
  return priceTwoDecimal;
};

export default function ExpenseCard(props) {
  const [spenders, setSpenders] = useState([]);
  const [dividedPrice, setDividedPrice] = useState("");

  const helperSpender = (arrayofobjects) => {
    let filteredarray = [];
    arrayofobjects.forEach((spender) => {
      filteredarray.push(spender.splitby.name);
    });
    return filteredarray;
  };

  //axios get spenders from backend for specific expense. props passed from DetailedInvoiceDisplay
  const getSpenders = async () => {
    let spendersData = await axios.get(
      `${process.env.REACT_APP_API_SERVER}/expenses/${props.expenseid}`
    );
    console.log("spenders list: ", spendersData.data);
    setSpenders(helperSpender(spendersData.data));
    setDividedPrice(spendersData.data[0].amount);
  };

  useEffect(() => {
    getSpenders();
  }, [props.expenseid]);

  const deleteExpense = async (expense) => {
    await axios
      .delete(`${process.env.REACT_APP_API_SERVER}/expenses/${expense}`)
      .then((response) => {
        console.log("delete expense response: ", response.data);
        props.refreshExpenseList();
      });
  };

  const deleteRecord = () => {
    deleteExpense(props.expenseid);
  };

  return (
    <ListItem>
      <ListItemAvatar>
        <TrashcanIcon deleteFunction={deleteRecord} />
      </ListItemAvatar>
      <ListItemText
        primary={props.itemName.toUpperCase()}
        secondary={spenders.join(", ")}
      />
      <ListItemSecondaryAction>
        <Typography variant="body2" color="textSecondary" component="span">
          ${getFormattedPrice(props.itemPrice)} ($
          {getFormattedPrice(dividedPrice)}
          /px) -- {props.paidby}
        </Typography>
      </ListItemSecondaryAction>
    </ListItem>
  );
}

const TrashcanIcon = (props) => {
  const [clearOpen, setClearOpen] = useState(false);

  return (
    <span>
      <IconButton
        onClick={() => {
          setClearOpen(true);
        }}
        aria-label="delete"
        size="small"
      >
        <DeleteIcon />
      </IconButton>

      <Dialog
        open={clearOpen}
        onClose={() => {
          setClearOpen(false);
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm delete?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure? This action is irreversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setClearOpen(false);
            }}
          >
            No
          </Button>
          <Button
            onClick={() => {
              setClearOpen(false);
              props.deleteFunction();
            }}
            autoFocus
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </span>
  );
};
