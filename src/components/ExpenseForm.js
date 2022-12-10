import React, { useState } from "react";
import { ref as databaseRef, push, set } from "firebase/database";
import { database } from "../firebase";
import Select from "react-select";
import FormControl from "@mui/material/FormControl";
import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import AddCircleOutlinedIcon from "@mui/icons-material/AddCircleOutlined";
import IconButton from "@mui/material/IconButton";

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
      {/* <input
        name="item"
        maxLength={24}
        required
      /> */}
      <center>
        <FormControl required sx={{ m: 2, width: "80ch" }} variant="standard">
          <InputLabel>Item Name</InputLabel>
          <Input
            required={true}
            value={item}
            onChange={({ target }) => setItem(target.value)}
            startAdornment={
              <InputAdornment position="start">
                <ShoppingCartOutlinedIcon />
              </InputAdornment>
            }
          />
        </FormControl>
        <FormControl required sx={{ m: 2, width: "80ch" }} variant="standard">
          <InputLabel>Amount</InputLabel>
          <Input
            required={true}
            value={amount}
            onChange={({ target }) => setAmount(target.value)}
            startAdornment={<InputAdornment position="start">$</InputAdornment>}
          />
        </FormControl>
        {/* <input
        name="amount"
        required
        pattern="^\d*(\.\d{0,2})?$"
        placeholder="Enter Price (Up 2 d.p.)"
      /> */}
        {/* <div className="dropdown-container"> */}
        <FormControl required sx={{ m: 2, width: "80ch" }} variant="standard">
          {/* <span>Select Name</span> */}
          <Select
            options={copyOfNameList}
            placeholder="Split amongst?*"
            value={splitBy}
            onChange={setSplitBy}
            isSearchable={true}
            isMulti
          />
        </FormControl>
        {/* </div> */}
        <br />
        <br />
        <IconButton size="large" onClick={handleSubmit}>
          <AddCircleOutlinedIcon color="primary" sx={{ fontSize: 40 }} />
        </IconButton>
        {/* <input type="submit" value="add record" /> */}
      </center>
      {/* </form> */}
    </div>
  );
}
