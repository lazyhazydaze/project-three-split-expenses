import React from "react";
import { ref as databaseRef, remove } from "firebase/database";
import { database } from "../firebase";
import "./ExpenseCard.css";

import {
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Typography,
} from "@mui/material";

const getFormattedPrice = (price) => {
  const priceTwoDecimal = Number(price).toFixed(2);
  return priceTwoDecimal;
};

export default function ExpenseCard(props) {
  const pricePerPax = () => {
    let output = (props.amount / props.splitBy.length).toFixed(2);
    return output;
  };

  const deleteRecord = () => {
    const db = databaseRef(
      database,
      "invoice/" + props.invoicekey + "/expenses/" + props.expensekey
    );
    remove(db);
  };

  let spenderArray = [];
  props.splitBy.forEach((spender) => spenderArray.push(spender.label));

  return (
    <ListItem>
      <ListItemAvatar>
        {props.deleterights && (
          <button value={props.expensekey} onClick={deleteRecord}>
            ✖
          </button>
        )}
      </ListItemAvatar>
      <ListItemText
        primary={props.item.toUpperCase()}
        secondary={spenderArray.join(", ")}
      />
      <ListItemSecondaryAction>
        <Typography variant="body2" color="textSecondary" component="span">
          ${getFormattedPrice(props.amount)} (${pricePerPax()}/px)
        </Typography>
      </ListItemSecondaryAction>
    </ListItem>
  );
}

// <div>
//   <div className="card">
//     <h3>{props.item.toUpperCase()}</h3>
//     <p>
//       <b>${getFormattedPrice(props.amount)}</b> (${pricePerPax()}/px)
//     </p>
//     <p>
//       <p>
//         <i>{spenderArray.join(", ")}</i>{" "}
//       </p>
//     </p>
//     {props.deleterights && (
//       <button value={props.expensekey} onClick={deleteRecord}>
//         ✖
//       </button>
//     )}
//   </div>
// </div>
