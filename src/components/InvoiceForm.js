import React, { useEffect, useState } from "react";
import { ref as databaseRef, push, set } from "firebase/database";
import { database } from "../firebase";
import GroupForm from "./GroupForm";

export default function InvoiceForm(props) {
  const [invoice, setInvoice] = useState("");
  const [author, setAuthor] = useState("");
  const [date, setDate] = useState("");
  const [group, setGroup] = useState([props.currentUser]);

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
    setDate("");
    setGroup([props.currentUser]);
  };

  useEffect(() => {
    setAuthor(props.currentUser);
    const newGroup = [...group];
    newGroup[0] = props.currentUser;
    setGroup(newGroup);
  }, [props.currentUser]);

  let copyGroup = [...group];

  return (
    <div>
      <center>
        <h4>1A. Who splitting with you</h4>
        <GroupForm nameList={group} addName={addName} />
        <br />
      </center>
      <hr />

      <h4>1B. Name this invoice</h4>
      <h4>{group.length} members:</h4>
      <div className="flex-grouplist">
        {copyGroup.map((k, i) => (
          <div>
            {k} {i !== 0 && <button onClick={() => deleteName(k)}>x</button>}
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
