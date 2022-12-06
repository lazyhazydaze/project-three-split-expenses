import React, { useState } from "react";
import { ref as databaseRef, remove } from "firebase/database";
import { database } from "../firebase";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DisplayExpense from "./DisplayExpense";
import ExpenseForm from "./ExpenseForm";
import ReceiptDisplay from "./ReceiptDisplay";

export default function DetailedInvoiceDisplay(props) {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const clearRecords = () => {
    const db = databaseRef(
      database,
      "invoice/" + props.currentKey + "/expenses"
    );
    remove(db);
  };

  return (
    <div>
      <center>
        <h1>{props.currentRecord.invoice}</h1>
        <h2>
          📅 {props.currentRecord.date} || ✍{" "}
          {props.currentRecord.author && props.currentRecord.author.username}{" "}
        </h2>
        <h4>
          {props.currentRecord.group ? props.currentRecord.group.length : 0}{" "}
          members:
        </h4>
        <div className="flex-grouplist">
          {props.currentRecord.group &&
            props.currentRecord.group.map((k, i) => <div>{k.label}</div>)}
        </div>
      </center>
      <hr />
      <center>
        <h1>Expenses Records || Split Bill</h1>
        {props.currentRecord.author &&
          props.currentRecord.author.email === props.currentUser.email && (
            <span>
              <Button variant="outlined" onClick={handleClickOpen}>
                Add new expense
              </Button>
              <Dialog open={open} onClose={handleClose}>
                <DialogContent>
                  <ExpenseForm
                    keyval={props.currentKey}
                    fullNameList={
                      props.currentRecord.group ? props.currentRecord.group : []
                    }
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose}>Close</Button>
                </DialogActions>
              </Dialog>
            </span>
          )}
        {props.currentRecord &&
          props.currentRecord.expenses &&
          props.currentRecord.author.email === props.currentUser.email && (
            <button onClick={clearRecords}>Clear all expenses</button>
          )}
      </center>
      <div className="row-flex">
        {props.currentRecord.expenses &&
          Object.keys(props.currentRecord.expenses).map((entry) => (
            <DisplayExpense
              {...props.currentRecord.expenses[entry]}
              invoicekey={props.currentKey}
              expensekey={entry}
              deleterights={
                props.currentRecord.author.email === props.currentUser.email
              }
            />
          ))}
      </div>

      <div>
        {props.currentRecord.expenses ? (
          <div className="flex-receipt">
            {props.currentRecord.group &&
              props.currentRecord.group.map(
                (name) =>
                  props.overallReceipt[name.value] && (
                    <ReceiptDisplay
                      name={name}
                      receipt={props.overallReceipt[name.value]}
                    />
                  )
              )}
          </div>
        ) : (
          <center>
            <h4>Nothing to split. Add a new expense to begin.</h4>
          </center>
        )}
      </div>
    </div>
  );
}
