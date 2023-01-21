import React, { useEffect, useState } from "react";
import Select from "react-select";
import FormControl from "@mui/material/FormControl";
import InputAdornment from "@mui/material/InputAdornment";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import AddCircleOutlinedIcon from "@mui/icons-material/AddCircleOutlined";
import IconButton from "@mui/material/IconButton";
import {
  InputLabel,
  MenuItem,
  TextField,
  Select as MuiSelect,
} from "@mui/material";
import axios from "axios";

export default function ExpenseForm(props) {
  const [item, setItem] = useState("");
  const [amount, setAmount] = useState("");
  const [payerOptions, setPayerOptions] = useState([]);
  const [spenderOptions, setSpenderOptions] = useState([]);
  const [payer, setPayer] = useState("");
  const [splitBy, setSplitBy] = useState([]);
  const [itemError, setItemError] = useState(true);
  const [itemErrorMessage, setItemErrorMessage] = useState(
    "Field cannot be blank."
  );
  const [amountError, setAmountError] = useState(true);
  const [amountErrorMessage, setAmountErrorMessage] = useState(
    "Field cannot be blank."
  );

  const helperPayer = (arrayofobjects) => {
    let filteredarray = [];
    arrayofobjects.forEach((object) => {
      filteredarray.push({
        userId: object.id,
        email: object.email,
        name: object.name,
      });
    });
    return filteredarray;
  };

  const helperSpender = (arrayofobjects) => {
    let filteredarray = [];
    arrayofobjects.forEach((object) => {
      filteredarray.push({
        value: object.id,
        label: object.name,
      });
    });
    return filteredarray;
  };

  // get the list of users of the group from groupId params to populate splitby field
  const getGroupMembers = async () => {
    let group = await axios.get(
      `${process.env.REACT_APP_API_SERVER}/groups/${props.groupId}`
    );
    console.log("payer options: ", helperPayer(group.data.users));
    console.log("spender options: ", helperSpender(group.data.users));
    setPayerOptions(helperPayer(group.data.users));
    setSpenderOptions(helperSpender(group.data.users));
  };

  useEffect(() => {
    getGroupMembers();
  }, [props.groupId]);

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

  const createNewExpense = async (name, price, payerid, spenders) => {
    const spenderIdsArray = spenders.map(({ value }) => value);
    console.log("spenderrrrrrs: ", spenders);
    console.log("spenderIdsArrayyyyyy: ", spenderIdsArray);
    let newExpense = {
      name: name,
      amount: price,
      payerId: payerid,
      splitByIds: spenderIdsArray,
    };
    await axios
      .post(
        `${process.env.REACT_APP_API_SERVER}/expenses/invoice/${props.invoiceId}`,
        newExpense
      )
      .then((response) => {
        console.log("create expense response", response.data);
        setItem("");
        setAmount("");
        setPayer("");
        setSplitBy([]);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!(itemError || amountError || splitBy.length === 0 || payer === "")) {
      createNewExpense(item, amount, payer, splitBy);
      props.reloadAllExpenses();
    }
  };

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
        <FormControl fullWidth>
          <InputLabel>Who paid?</InputLabel>
          <MuiSelect
            value={payer}
            label="Payer"
            onChange={(e) => {
              setPayer(e.target.value);
            }}
          >
            {payerOptions.map((person) => (
              <MenuItem
                key={person.userId}
                value={person.userId} //or should this be payer.email?
              >
                {person.name}
              </MenuItem>
            ))}
          </MuiSelect>
        </FormControl>
      </center>
      <br />
      <br />
      <center>
        <FormControl required sx={{ width: "80ch" }} variant="standard">
          <Select
            closeMenuOnSelect={false}
            options={spenderOptions}
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
