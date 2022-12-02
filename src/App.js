import React, { useEffect, useState } from "react";
import { ref as databaseRef, onValue, remove } from "firebase/database";
import { database } from "./firebase";
import "./App.css";
import DisplayExpense from "./components/DisplayExpense";
import ExpenseForm from "./components/ExpenseForm";
import ReceiptDisplay from "./components/ReceiptDisplay";
import InvoiceForm from "./components/InvoiceForm";
import InvoiceRetrieve from "./components/InvoiceRetrieve";

export default function App() {
  const [currentUser, setCurrentUser] = useState("myself");
  const [uniqueNames, setUniqueNames] = useState([]);
  const [overallReceipt, setOverallReceipt] = useState({});
  const [currentRecord, setCurrentRecord] = useState({});
  const [currentKey, setCurrentKey] = useState("");

  const setCurrentRecordListener = (keyval) => {
    setCurrentKey(keyval);
    const db = databaseRef(database, "invoice/" + keyval);
    onValue(db, (snapshot) => {
      if (snapshot.val()) {
        setCurrentRecord(snapshot.val());
      } else {
        setCurrentRecord({});
        setCurrentKey("");
      }
    });
  };

  useEffect(() => {
    splitBill();
  }, [currentRecord]);

  useEffect(() => {
    setCurrentRecord({});
    setCurrentKey("");
  }, [currentUser]);

  const clearRecords = () => {
    const db = databaseRef(database, "invoice/" + currentKey + "/expenses");
    remove(db);
  };

  const splitBill = () => {
    if ("expenses" in currentRecord) {
      let spenderList = [];
      for (const [key, value] of Object.entries(currentRecord.expenses)) {
        spenderList = spenderList.concat(value.splitBy);
      }

      let uniqueNamesList = [...new Set(spenderList)];

      let newReceipt = {};
      for (let k = 0; k < uniqueNamesList.length; k++) {
        var purchase = [];
        var cost = [];
        var initialValue = 0;
        for (const [key, value] of Object.entries(currentRecord.expenses)) {
          if (value["splitBy"].includes(uniqueNamesList[k])) {
            purchase.push(value["item"]);
            cost.push(value["amount"] / value["splitBy"].length);
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
      setOverallReceipt(newReceipt);
      setUniqueNames(uniqueNamesList);
    } else {
      setOverallReceipt({});
      setUniqueNames([]);
    }
  };

  let sortUniqueNames = [...uniqueNames].sort();
  let copyOverallReceipt = overallReceipt;

  return (
    <div>
      <div>
        <u>
          <h1>This is the HOMEPAGE.</h1>
        </u>
        Current username:{" "}
        <input
          type="text"
          value={currentUser}
          onChange={({ target }) => setCurrentUser(target.value)}
          placeholder="current username"
        />
        <p>
          It has a dashboard, a section for invoices, and sidebar with a{" "}
          <button>Split-A-Bill</button> link.
        </p>
        <h2>Invoices section</h2>
        <InvoiceRetrieve
          currentUser={currentUser}
          setCurrentRecordListener={setCurrentRecordListener}
        />
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
          <InvoiceForm currentUser={currentUser} />
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
        {currentRecord.author === currentUser && (
          <div>
            <center>
              <h4>2. Add item</h4>
            </center>
            <ExpenseForm
              keyval={currentKey}
              fullNameList={currentRecord.group ? currentRecord.group : ""}
            />
            <br />
          </div>
        )}
        <center>
          <h2 className="bangers">📜RECORDS OF EXPENSES📜</h2>
          <br />
          {console.log("line 151", currentRecord.expenses)}
          <div className="row-flex">
            {currentRecord.expenses &&
              Object.keys(currentRecord.expenses).map((entry) => (
                <DisplayExpense
                  {...currentRecord.expenses[entry]}
                  invoicekey={currentKey}
                  expensekey={entry}
                  deleterights={currentRecord.author === currentUser}
                />
              ))}
          </div>
          {currentRecord.author === currentUser && currentRecord.expenses && (
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
