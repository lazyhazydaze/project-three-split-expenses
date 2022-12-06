import React, { useEffect, useState } from "react";
import { ref as databaseRef, push, set } from "firebase/database";
import { database } from "../firebase";

// Placeholder contactlist for selection purposes
import { contactList } from "../data";

// Libraries for styling
import Select from "react-select";
import dayjs from "dayjs";
import TextField from "@mui/material/TextField";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";

export default function InvoiceForm(props) {
  //props.currentUser properties passed from currentUser state in App.js
  //author is an object, same as currentUser {username: "", email:""}

  const [invoice, setInvoice] = useState("");
  const [author, setAuthor] = useState(props.currentUser);
  const [date, setDate] = useState(dayjs());

  // the list of selectedFriends will always include the author
  const [selectedFriends, setSelectedFriends] = useState([
    {
      value: props.currentUser.email,
      label: props.currentUser.username,
      isFixed: true,
    },
  ]);

  // add the currentUser to the top of the contact list and set it as a default fixed option.
  let combinedContactList = [
    {
      value: props.currentUser.email,
      label: props.currentUser.username,
      isFixed: true,
    },
    ...contactList,
  ];

  // On submit, invoice (invoice name, author, date, selectedFriends as group) is pushed into db.

  const handleSubmit = (e) => {
    e.preventDefault();
    const dbRef = push(databaseRef(database, "invoice"));
    set(dbRef, {
      invoice,
      author,
      date: date.format("DD/MM/YYYY"),
      group: selectedFriends,
    });
    setInvoice("");
    setDate(dayjs());
    setSelectedFriends([
      {
        value: props.currentUser.email,
        label: props.currentUser.username,
        isFixed: true,
      },
    ]);
  };

  // when currentUser change, replace the author and the first element of the selectedFriends to be the new currentUser.
  useEffect(() => {
    setAuthor(props.currentUser);
    const newGroup = [...selectedFriends];
    newGroup[0] = {
      value: props.currentUser.email,
      label: props.currentUser.username,
      isFixed: true,
    };
    setSelectedFriends(newGroup);
  }, [props.currentUser]);

  return (
    <div>
      <center>
        <h2>1. Who's Splitting With You ---- 2. Name Invoice</h2>

        <div className="dropdown-container">
          <Select
            options={combinedContactList}
            placeholder="Select Name"
            value={selectedFriends}
            defaultValue={combinedContactList[0]}
            onChange={setSelectedFriends}
            isSearchable={true}
            isMulti
            styles={{
              multiValue: (base, state) => {
                return state.data.isFixed
                  ? { ...base, backgroundColor: "gray" }
                  : base;
              },
              multiValueLabel: (base, state) => {
                return state.data.isFixed
                  ? {
                      ...base,
                      fontWeight: "bold",
                      color: "white",
                      paddingRight: 6,
                    }
                  : base;
              },
              multiValueRemove: (base, state) => {
                return state.data.isFixed ? { ...base, display: "none" } : base;
              },
            }}
          />
        </div>
        <br />
      </center>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="invoice"
          value={invoice}
          placeholder="Enter Invoice Name"
          onChange={({ target }) => setInvoice(target.value)}
          required
        />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DesktopDatePicker
            label="Date"
            inputFormat="MM/DD/YYYY"
            value={date}
            onChange={(newValue) => setDate(newValue)}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
        <br />
        <center>
          <input type="submit" value="Next" />
        </center>
      </form>
    </div>
  );
}
