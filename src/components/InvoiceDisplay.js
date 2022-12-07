import React from "react";
import { ref as databaseRef, remove } from "firebase/database";
import { database } from "../firebase";
import "./DisplayExpense.css";

export default function InvoiceDisplay(props) {
  //idvalue properties is passed from InvoiceRetrieve.js, which is the key of the Invoice in db.
  //clickMe properties
  //deleterights properties
  //expensekey properties
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
        <p>By: {props.author.username}</p>
        {props.deleterights && (
          <button value={props.expensekey} onClick={deleteInvoice}>
            ✖
          </button>
        )}
      </div>
    </div>
  );
}
