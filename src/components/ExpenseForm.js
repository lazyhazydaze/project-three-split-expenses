import React, { useState } from "react";

export default function ExpenseForm(props) {
  const [item, setItem] = useState("");
  const [amount, setAmount] = useState("");
  const [spenders, setSpenders] = useState([]);
  const [start, setStart] = useState(true);

  const handleChangeCheckBox = (e) => {
    const { checked, value } = e.target;

    if (checked) {
      const newSpenderList = [...spenders, value];
      setSpenders(newSpenderList);
      setStart(false);
    } else {
      setSpenders(spenders.filter((e) => e !== value));
      setStart(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (spenders.length < 1) {
      alert("Please select spender field");
      return;
    }

    const record = {
      item: item,
      amount: amount,
      spenders: spenders,
    };

    props.action(record);
    setItem("");
    setAmount("");
    setSpenders([]);
    setStart(true);
  };

  let copyOfNameList = [...props.fullNameList];

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          className="input-field"
          type="text"
          name="item"
          maxLength={24}
          value={item}
          required
          onChange={({ target }) => setItem(target.value)}
          placeholder="Enter Item Name"
        />
        <input
          className="input-field"
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
          <input className="white-btn" type="submit" value="SUBMIT" />
        </center>
      </form>
    </div>
  );
}
