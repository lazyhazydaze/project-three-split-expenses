import React from "react";
import { ref as databaseRef, remove } from "firebase/database";
import { database } from "../firebase";
import "./DisplayExpense.css";

const getFormattedPrice = (price) => {
  const priceTwoDecimal = Number(price).toFixed(2);
  return priceTwoDecimal;
};

const getRandomColor = () => {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

export default function DisplayExpense(props) {
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

  return (
    <div className="column">
      <div className="card">
        <h3 className="bangers" style={{ color: getRandomColor() }}>
          {props.item.toUpperCase()}
        </h3>
        <p>
          <b>${getFormattedPrice(props.amount)}</b> (${pricePerPax()}/px)
        </p>
        <p>
          <p>
            <i>{props.splitBy.join(" ")}</i>{" "}
          </p>
        </p>
        {props.deleterights&&<button value={props.expensekey} onClick={deleteRecord}>
          ✖
        </button>}
      </div>
    </div>
  );
}
