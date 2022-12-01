import React, { useState } from "react";
import { ref as databaseRef, push, set } from "firebase/database";
import { database } from "../firebase";

export default function ExpenseForm(props) {
  const [item, setItem] = useState("");
  const [amount, setAmount] = useState("");
  const [splitBy, setSplitBy] = useState([]);
  const [start, setStart] = useState(true);

  const handleChangeCheckBox = (e) => {
    const { checked, value } = e.target;

    if (checked) {
      const newSpenderList = [...splitBy, value];
      setSplitBy(newSpenderList);
      setStart(false);
    } else {
      setSplitBy(splitBy.filter((e) => e !== value));
      setStart(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (splitBy.length < 1) {
      alert("Please select spender field");
      return;
    }

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
    setStart(true);
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
        <b>
          <span style={{ color: "#ffc312" }}>
            <u>Split amongst:</u>
          </span>
        </b>
        <br />
        <br />
        <div className="flex-spender">
          {copyOfNameList.map((name, i) => (
            <div key={i}>
              {start ? (
                <input
                  type="checkbox"
                  name={name}
                  value={name}
                  checked={false}
                  onChange={(e) => handleChangeCheckBox(e)}
                />
              ) : (
                <input
                  type="checkbox"
                  name={name}
                  value={name}
                  onChange={(e) => handleChangeCheckBox(e)}
                />
              )}
              {name}
            </div>
          ))}{" "}
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
