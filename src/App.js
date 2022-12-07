import { Routes, Route } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { ref as databaseRef, onValue } from "firebase/database";
import { database } from "./firebase";
import "./App.css";

import Homepage from "./components/Homepage";
import InvoiceForm from "./components/InvoiceForm";
import InvoiceRetrieve from "./components/InvoiceRetrieve";
import DetailedInvoiceDisplay from "./components/DetailedInvoiceDisplay";

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
        <center>
          Current usernamep placeholder:{" "}
          <input
            type="text"
            value={currentUser.username || ""}
            name="username"
            onChange={handleChange}
            placeholder="current username"
          />
          Current email placeholder:
          <input
            type="text"
            value={currentUser.email || ""}
            name="email"
            onChange={handleChange}
            placeholder="current username"
          />
        </center>
      </div>
      <br />

      <div>
        <Routes>
          <Route path="/" element={<Homepage />}>
            <Route
              path="splitabill"
              element={<InvoiceForm currentUser={currentUser} />}
            />
            <Route
              path="invoices"
              element={
                <InvoiceRetrieve
                  currentUser={currentUser}
                  setCurrentRecordListener={setCurrentRecordListener}
                />
              }
            >
              <Route
                path=":invoiceId"
                element={
                  <DetailedInvoiceDisplay
                    currentRecord={currentRecord}
                    currentUser={currentUser}
                    currentKey={currentKey}
                    overallReceipt={overallReceipt}
                  />
                }
              />
            </Route>
            <Route
              path="*"
              element={
                <main style={{ padding: "1rem" }}>
                  <p>There's nothing here!</p>
                </main>
              }
            />
          </Route>
        </Routes>
      </div>

      {/* {console.log("line 194", currentRecord)}
      {console.log("line 195", currentRecord.expenses)} */}
    </div>
  );
}
