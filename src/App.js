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
  // When user logs in, currentUser state is set with username and email.
  // For now, input fields with handleChange function is used as a placeholder.
  // When integrate with Firebase auth, can retrieve from Auth database and set it to currentUser
  const [currentUser, setCurrentUser] = useState({
    username: "Hazelle",
    email: "hazelle@gmail.com",
  });

  // placeholder handleChange function before integration with auth form

  const handleChange = ({ target }) => {
    const { name, value } = target;
    setCurrentUser((prevState) => ({ ...prevState, [name]: value }));
  };

  // currentRecord state is an object, refers to the invoice, which houses author, date, name of the invoice, and group of selected friends.

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

  const [overallReceipt, setOverallReceipt] = useState({});

  const splitBill = () => {
    if ("expenses" in currentRecord) {
      let newReceipt = {};
      for (let k = 0; k < currentRecord.group.length; k++) {
        let purchase = [];
        let cost = [];
        let initialValue = 0;
        for (const [key, value] of Object.entries(currentRecord.expenses)) {
          const splitByArray = value.splitBy;
          splitByArray.forEach((element) => {
            if (element.value === currentRecord.group[k].value) {
              purchase.push(value.item);
              cost.push(value.amount / value.splitBy.length);
            }
          });

          var record = {
            username: currentRecord.group[k].label,
            purchases: purchase,
            costprice: cost,
            total: cost.reduce(
              (previousValue, currentValue) => previousValue + currentValue,
              initialValue
            ),
          };
        }
        console.log("newReceipt", newReceipt);
        newReceipt[currentRecord.group[k].value] = record;
      }
      setOverallReceipt(newReceipt);
    } else {
      setOverallReceipt({});
    }
  };

  return (
    <div>
      <div>
        <u>
          <h1>This is the HOMEPAGE.</h1>
        </u>
        Current username:{" "}
        <input
          type="text"
          value={currentUser.username || ""}
          name="username"
          onChange={handleChange}
          placeholder="current username"
        />
        Current email:
        <input
          type="text"
          value={currentUser.email || ""}
          name="email"
          onChange={handleChange}
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
            📅 {currentRecord.date} || ✍{" "}
            {currentRecord.author && currentRecord.author.username}{" "}
          </h3>
          <br />
          <h4>
            {currentRecord.group ? currentRecord.group.length : 0} members:
          </h4>
          <div className="flex-grouplist">
            {currentRecord.group &&
              currentRecord.group.map((k, i) => <div>{k.label}</div>)}
          </div>
        </center>
        <center>
          <h2>Expenses Records || Split Bill</h2>
        </center>
      </div>

      <div className="green-container">
        {currentRecord.author &&
          currentRecord.author.email === currentUser.email && (
            <div>
              <center>
                <h4>2. Add item</h4>
              </center>
              <ExpenseForm
                keyval={currentKey}
                fullNameList={currentRecord.group ? currentRecord.group : []}
              />
              <br />
            </div>
          )}
        <center>
          <h2>📜RECORDS OF EXPENSES📜</h2>
          <br />
          {console.log("line 194", currentRecord)}
          {console.log("line 195", currentRecord.expenses)}
          <div className="row-flex">
            {currentRecord.expenses &&
              Object.keys(currentRecord.expenses).map((entry) => (
                <DisplayExpense
                  {...currentRecord.expenses[entry]}
                  invoicekey={currentKey}
                  expensekey={entry}
                  deleterights={
                    currentRecord.author.email === currentUser.email
                  }
                />
              ))}
          </div>

          {currentRecord &&
            currentRecord.expenses &&
            currentRecord.author.email === currentUser.email && (
              <button onClick={clearRecords}>Clear all</button>
            )}
        </center>
      </div>
      <div className="green-container">
        <center>
          <h4>3. final split bill</h4>
        </center>
        <div className="flex-receipt">
          {currentRecord.group &&
            currentRecord.group.map(
              (name) =>
                overallReceipt[name.value] && (
                  <ReceiptDisplay
                    name={name}
                    receipt={overallReceipt[name.value]}
                  />
                )
            )}
        </div>
      </div>
    </div>
  );
}
