import React, { useState } from "react";
import { ref as databaseRef, onValue, remove } from "firebase/database";
import { database } from "./firebase";
import "./App.css";
import DisplayExpense from "./components/DisplayExpense";
import ExpenseForm from "./components/ExpenseForm";
import SplitBill from "./components/SplitBill";
import ReceiptDisplay from "./components/ReceiptDisplay";
import InvoiceForm from "./components/InvoiceForm";
import InvoiceRetrieve from "./components/InvoiceRetrieve";

export default function App() {
  const [uniqueNames, setUniqueNames] = useState([]);
  const [overallReceipt, setOverallReceipt] = useState({});
  const [expenses, setExpenses] = useState([]);
  const [currentRecord, setCurrentRecord] = useState({});
  const [currentKey, setCurrentKey] = useState("");

  const setCurrentRecordListener = (keyval) => {
    setCurrentKey(keyval);
    const db = databaseRef(database, "invoice/" + keyval);
    onValue(db, (snapshot) => {
      setCurrentRecord(snapshot.val());
    });
  };

  const clearRecords = () => {
    const db = databaseRef(database, "invoice/" + currentKey + "/expenses");
    remove(db);
  };

  const splitBill = () => {
    let expensesList = [...expenses];
    let spenderList = [];
    for (let i = 0; i < expensesList.length; i++) {
      spenderList = [...spenderList, ...expensesList[i].splitBy];
    }
    let uniqueNamesList = [...new Set(spenderList)];

    let newReceipt = {};
    for (let k = 0; k < uniqueNamesList.length; k++) {
      var purchase = [];
      var cost = [];
      var initialValue = 0;
      for (let j = 0; j < expensesList.length; j++) {
        if (expensesList[j]["splitBy"].includes(uniqueNamesList[k])) {
          purchase.push(expensesList[j]["item"]);
          cost.push(
            expensesList[j]["amount"] / expensesList[j]["splitBy"].length
          );
        }

        var record = {
          purchases: purchase,
          costprice: cost,
          total: cost.reduce(
            (previousValue, currentValue) => previousValue + currentValue,
            initialValue
          ),
        };
      }
      newReceipt[uniqueNamesList[k]] = record;
    }
    console.log("state newReceipt", newReceipt);
    console.log("state uniqueNames", uniqueNamesList);
    setOverallReceipt(newReceipt);
    setUniqueNames(uniqueNamesList);
  };

  let copyUniqueNames = [...uniqueNames];
  let sortUniqueNames = copyUniqueNames.sort();
  let copyOverallReceipt = overallReceipt;

  return (
    <div>
      <div>
        <u>
          <h1>This is the HOMEPAGE.</h1>
        </u>
        <p>
          It has a dashboard, a section for invoices, and sidebar with a{" "}
          <button>Split-A-Bill</button> link.
        </p>
        <h2>Invoices section</h2>
        <InvoiceRetrieve setCurrentRecordListener={setCurrentRecordListener} />
      </div>
      <hr />
      <div>
        <u>
          <h1>
            On clicking <button>Split-A-Bill</button> from Homepage sidemenu{" "}
          </h1>
        </u>
        <center>
          <h2>Who's splitting with you || Name your invoice</h2>
        </center>
      </div>

      <div className="green-container">
        <center>
          <InvoiceForm />
        </center>
      </div>
      <hr />

      <div>
        <u>
          <h1>
            On clicking <button>Next</button>, will direct back to HOMEPAGE, and
            invoices section is updated with a record that is clickable.
          </h1>
        </u>
      </div>
      <hr />
      <div>
        <u>
          <h1>On clicking the record under the Invoice section</h1>
        </u>
        <center>
          <h2>{currentRecord.invoice}</h2>
          <h3>
            📅 {currentRecord.date} || ✍ {currentRecord.author}{" "}
          </h3>
          <br />
          <h4>
            {currentRecord.group ? currentRecord.group.length : 0} members:
          </h4>
          <div className="flex-grouplist">
            {currentRecord.group &&
              currentRecord.group.map((k, i) => <div>{k}</div>)}
          </div>
        </center>
        <center>
          <h2>Expenses Records || Split Bill</h2>
        </center>
      </div>

      <div className="green-container">
        <center>
          <h4>2. Add item</h4>
        </center>
        <ExpenseForm
          keyval={currentKey}
          fullNameList={currentRecord.group ? currentRecord.group : ""}
        />
        <br />
        <SplitBill uniqueName={uniqueNames} action={splitBill} />
        <center>
          <h2 className="bangers">📜RECORDS OF EXPENSES📜</h2>
          <br />
          <div className="row-flex">
            {currentRecord.expenses &&
              Object.keys(currentRecord.expenses).map((entry) => (
                <DisplayExpense
                  {...currentRecord.expenses[entry]}
                  keyval={currentKey}
                  id={entry}
                />
              ))}
          </div>
          {currentRecord.expenses && (
            <button onClick={clearRecords}>Clear all</button>
          )}
        </center>
      </div>
      <div className="green-container">
        <center>
          <h4>3. final split bill</h4>
        </center>
        <div className="flex-receipt">
          {sortUniqueNames.map((name) => (
            <ReceiptDisplay name={name} receipt={copyOverallReceipt[name]} />
          ))}
        </div>
      </div>
    </div>
  );
}
