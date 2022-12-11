import React, { useState } from "react";
import { ref as databaseRef, push, set } from "firebase/database";
import { database } from "../firebase";
import Select from "react-select";
import FormControl from "@mui/material/FormControl";
import InputAdornment from "@mui/material/InputAdornment";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import AddCircleOutlinedIcon from "@mui/icons-material/AddCircleOutlined";
import IconButton from "@mui/material/IconButton";
import { TextField } from "@mui/material";

export default function ExpenseForm(props) {
  const [item, setItem] = useState("");
  const [amount, setAmount] = useState("");
  const [splitBy, setSplitBy] = useState([]);
  const [itemError, setItemError] = useState(true);
  const [itemErrorMessage, setItemErrorMessage] = useState(
    "Field cannot be blank."
  );
  const [amountError, setAmountError] = useState(true);
  const [amountErrorMessage, setAmountErrorMessage] = useState(
    "Field cannot be blank."
  );

  const validateItemName = (itemValue) => {
    if (itemValue === "") {
      setItemError(true);
      setItemErrorMessage("Field cannot be blank.");
    } else if (itemValue.length > 30) {
      setItemError(true);
      setItemErrorMessage(`Max 30 char (Current: ${itemValue.length} char). `);
    } else {
      setItemError(false);
    }
    setItem(itemValue);
  };

  const validateAmount = (amountValue) => {
    if (amountValue === "") {
      setAmountError(true);
      setAmountErrorMessage("Field cannot be blank.");
    } else if (!/^\d*(\.\d{0,2})?$/.test(amountValue)) {
      setAmountError(true);
      setAmountErrorMessage("Enter a number up to 2 d.p.");
    } else {
      setAmountError(false);
    }
    setAmount(amountValue);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!(itemError || amountError || splitBy.length === 0)) {
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
    }
  };

  let copyOfNameList = [...props.fullNameList];

  return (
    <div>
      <center>
        <FormControl required sx={{ mt: 2, width: "80ch" }} variant="standard">
          <TextField
            required
            label="Item Name"
            value={item}
            onChange={({ target }) => validateItemName(target.value)}
            error={itemError}
            helperText={itemError && itemErrorMessage}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <ShoppingCartOutlinedIcon />
                </InputAdornment>
              ),
            }}
          />
        </FormControl>
      </center>
      <center>
        <FormControl required sx={{ m: 2, width: "80ch" }} variant="standard">
          <TextField
            required
            label="Amount"
            value={amount}
            onChange={({ target }) => validateAmount(target.value)}
            error={amountError}
            helperText={amountError && amountErrorMessage}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">$</InputAdornment>
              ),
            }}
          />
        </FormControl>
      </center>
      <center>
        <FormControl required sx={{ width: "80ch" }} variant="standard">
          <Select
            closeMenuOnSelect={false}
            options={copyOfNameList}
            value={splitBy}
            onChange={setSplitBy}
            isSearchable={true}
            isMulti
          />
        </FormControl>
      </center>
      <br />
      <center>
        <IconButton size="large" onClick={handleSubmit}>
          <AddCircleOutlinedIcon color="primary" sx={{ fontSize: 40 }} />
        </IconButton>
      </center>
    </div>
  );
}
