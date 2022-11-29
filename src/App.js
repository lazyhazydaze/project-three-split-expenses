import React, { useState } from "react";
// import { ref as databaseRef, push, set } from "firebase/database";
// import { database } from "./firebase";
import "./App.css";
import DisplayExpense from "./components/DisplayExpense";
import ExpenseForm from "./components/ExpenseForm";
import GroupForm from "./components/GroupForm";
import SplitBill from "./components/SplitBill";
import ReceiptDisplay from "./components/ReceiptDisplay";

export default function App() {
  const [uniqueNames, setUniqueNames] = useState([]);
  const [overallReceipt, setOverallReceipt] = useState({});
  const [group, setGroup] = useState([]);
  const [expenses, setExpenses] = useState([]);

  // Container 1 (form) and Container 4 (display)
  // Related functions: addName & deleteName
  // Related child component: GroupForm (form)
  // Updates this.state.group array with strings of names

  const addName = (name) => {
    const newGroup = [...group, name];
    setGroup(newGroup);
  };

  const deleteName = (name) => {
    const filteredGroup = group.filter((x) => x !== name);
    setGroup(filteredGroup);
  };

  // Container 2 (form) and Records section (display)
  // Related functions: deleteRecord, addRecord, clearRecords
  // Related child component: ExpenseForm (form)
  // Related sibling component: DisplayExpense (display)
  // Updates this.state.expense array with objects

  const addRecord = (record) => {
    const newArray = [...expenses, record];
    console.log("line 72", newArray);
    setExpenses(newArray);
  };

  const deleteRecord = (e) => {
    // deleteRecord takes in a parameter (like addName or deleteName)
    // e is the event, e.target is the button, the value in e.target.value is defined in Line 38 of dispay expense which takes its value from the id which is an index.
    let key = e.target.value;
    let newexpenses = [...expenses];
    newexpenses.splice(key, 1);
    setExpenses(newexpenses);
  };

  const clearRecords = () => {
    setExpenses([]);
  };

  // Container 3 (button) and same container (display)
  // Related functions: splitBill
  // Related child component: ReceiptDisplay (display)
  // Updates this.state.uniqueNames array with strings of names from this.state.expenses
  // Updates this.state.overallReceipt object (not array) with dictionary of purchases, item price, and total with name as key

  const splitBill = () => {
    let expensesList = [...expenses];
    let spenderList = [];
    for (let i = 0; i < expensesList.length; i++) {
      spenderList = [...spenderList, ...expensesList[i].spenders];
    }
    let uniqueNamesList = [...new Set(spenderList)];

    let newReceipt = {};
    for (let k = 0; k < uniqueNamesList.length; k++) {
      var purchase = [];
      var cost = [];
      var initialValue = 0;
      for (let j = 0; j < expensesList.length; j++) {
        if (expensesList[j]["spenders"].includes(uniqueNamesList[k])) {
          purchase.push(expensesList[j]["item"]);
          cost.push(
            expensesList[j]["amount"] / expensesList[j]["spenders"].length
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

  let copyGroup = [...group];
  let copyExpenses = [...expenses];
  let copyUniqueNames = [...uniqueNames];
  let sortUniqueNames = copyUniqueNames.sort();
  let copyOverallReceipt = overallReceipt;

  return (
    <div>
      <div className="flex-container">
        <div className="green-container">
          <center>
            <h4 className="step">1. Add person</h4>
          </center>
          <GroupForm nameList={group} addName={addName} />
        </div>

        <div className="green-container">
          <center>
            <h4 className="step">2. Add item</h4>
          </center>
          <ExpenseForm fullNameList={group} action={addRecord} />
        </div>
        <div className="green-container">
          <center>
            <h4 className="step">3. View Receipt</h4>
          </center>
          <div className="flex-receipt">
            {sortUniqueNames.map((name) => (
              <ReceiptDisplay name={name} receipt={copyOverallReceipt[name]} />
            ))}
          </div>
          <SplitBill uniqueName={uniqueNames} action={splitBill} />
        </div>

        <div className="green-container">
          <center>
            <h4 className="step">4. Edit Group List</h4>
          </center>
          <div className="flex-grouplist">
            {copyGroup.map((k, i) => (
              <div>
                {k} <button onClick={() => deleteName(k)}>x</button>
              </div>
            ))}
          </div>
        </div>
      </div>
      <br />

      <div>
        <center>
          {expenses.length > 0 && (
            <h2 className="bangers">📜RECORDS OF EXPENSES📜</h2>
          )}
        </center>
        <div className="row-flex">
          {copyExpenses.map((entry, i) => (
            <DisplayExpense
              {...entry}
              key={i}
              id={i}
              deleteRecord={deleteRecord}
            />
          ))}
        </div>
      </div>
      <br />
      {expenses.length > 0 && (
        <center>
          <button onClick={clearRecords}>Clear all</button>
        </center>
      )}
    </div>
  );
}
