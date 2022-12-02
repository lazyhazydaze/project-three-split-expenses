import React from "react";
import { ref as databaseRef, remove } from "firebase/database";
import { database } from "../firebase";
import "./DisplayExpense.css";

export default function InvoiceDisplay(props) {
  const deleteInvoice = (e) => {
    e.preventDefault();
    const db = databaseRef(database, "invoice/" + props.idvalue);
    remove(db);
  };
  return (
    <div className="column" id={props.idvalue} onClick={props.clickMe}>
      <div className="card">
        <h3>{props.invoice}</h3>
        <p>{props.date}</p>
        <p>By: {props.author}</p>
        {props.deleterights && (
          <button value={props.expensekey} onClick={deleteInvoice}>
            ✖
          </button>
        )}
      </div>
    </div>
  );
}
