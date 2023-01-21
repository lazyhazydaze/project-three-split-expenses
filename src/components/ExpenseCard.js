import React, { useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";

import {
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Typography,
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

  const deleteRecord = () => {
    console.log("add in router for delete record");
  };

  return (
    <ListItem>
      <ListItemAvatar>
        <IconButton aria-label="delete" onClick={deleteRecord}>
          <DeleteIcon />
        </IconButton>
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

// add in a text for paidby too
