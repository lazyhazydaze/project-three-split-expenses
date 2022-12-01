import React, { useState } from "react";
import { ref as databaseRef, push, set } from "firebase/database";
import { database } from "../firebase";
import GroupForm from "./GroupForm";

export default function InvoiceForm(props) {
  const [invoice, setInvoice] = useState("");
  const [author, setAuthor] = useState("");
  const [date, setDate] = useState("");
  const [group, setGroup] = useState(["myself"]);

  const addName = (name) => {
    const newGroup = [...group, name];
    setGroup(newGroup);
  };

  const deleteName = (name) => {
    const filteredGroup = group.filter((x) => x !== name);
    setGroup(filteredGroup);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dbRef = push(databaseRef(database, "invoice"));
    set(dbRef, {
      invoice,
      author,
      date,
      group,
    });
    setInvoice("");
    setAuthor("");
    setDate("");
    setGroup(["myself"]);
  };

  let copyGroup = [...group];

  return (
    <div>
      <center>
        <h4>1A. Who splitting with you</h4>
        <GroupForm nameList={group} addName={addName} />
        <br />
        <button>Continue to 1B. </button>
      </center>
      <hr />

      <h4>1B. Name this invoice</h4>
      <h4>{group.length} members:</h4>
      <div className="flex-grouplist">
        {copyGroup.map((k, i) => (
          <div>
            {k} <button onClick={() => deleteName(k)}>x</button>
          </div>
        ))}
      </div>
      <br />
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="invoice"
          value={invoice}
          placeholder="Enter Invoice Name"
          onChange={({ target }) => setInvoice(target.value)}
          required
        />
        <input
          type="text"
          name="author"
          value={author}
          placeholder="Enter Author Name"
          onChange={({ target }) => setAuthor(target.value)}
          required
        />
        <input
          type="text"
          name="date"
          value={date}
          placeholder="Enter Date"
          onChange={({ target }) => setDate(target.value)}
          required
        />
        <input type="submit" value="Next" />
      </form>
    </div>
  );
}
