import React from "react";
import "./DisplayExpense.css";

export default function InvoiceDisplay(props) {
  return (
    <div className="column" id={props.idvalue} onClick={props.clickMe}>
      <div className="card">
        <h3>{props.invoice}</h3>
        <p>{props.date}</p>
        <p>By: {props.author}</p>
      </div>
    </div>
  );
}
