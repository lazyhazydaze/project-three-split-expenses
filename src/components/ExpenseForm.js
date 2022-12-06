import React, { useState } from "react";
import { ref as databaseRef, push, set } from "firebase/database";
import { database } from "../firebase";
import Select from "react-select";

export default function ExpenseForm(props) {
  const [item, setItem] = useState("");
  const [amount, setAmount] = useState("");
  const [splitBy, setSplitBy] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const record = {
      item: item,
      amount: amount,
      splitBy: splitBy,
    };
    const dbRef = push(
      databaseRef(database, "invoice/" + props.keyval + "/expenses")
    );
    set(dbRef, record);
    setItem("");
    setAmount("");
    setSplitBy([]);
  };

  let copyOfNameList = [...props.fullNameList];

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="item"
          maxLength={24}
          value={item}
          required
          onChange={({ target }) => setItem(target.value)}
          placeholder="Enter Item Name"
        />
        <input
          type="text"
          name="amount"
          value={amount}
          required
          onChange={({ target }) => setAmount(target.value)}
          pattern="^\d*(\.\d{0,2})?$"
          placeholder="Enter Price (Up 2 d.p.)"
        />
        <br />
        <br />
        <div className="dropdown-container">
          <Select
            options={copyOfNameList}
            placeholder="Split amongst?"
            value={splitBy}
            onChange={setSplitBy}
            isSearchable={true}
            isMulti
          />
        </div>
        <br />
        <br />
        <center>
          <input type="submit" value="add record" />
        </center>
      </form>
    </div>
  );
}
