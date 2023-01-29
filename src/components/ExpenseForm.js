import React, { useEffect, useState } from "react";
import FormControl from "@mui/material/FormControl";
import Snackbar from "@mui/material/Snackbar";
import InputAdornment from "@mui/material/InputAdornment";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import AddCircleOutlinedIcon from "@mui/icons-material/AddCircleOutlined";
import IconButton from "@mui/material/IconButton";
import { useTheme } from "@mui/material/styles";
import {
  InputLabel,
  MenuItem,
  TextField,
  Select as MuiSelect,
  OutlinedInput,
  Alert,
  AlertTitle,
} from "@mui/material";
import axios from "axios";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

export default function ExpenseForm(props) {
  const theme = useTheme();
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
  const [openAlert, setOpenAlert] = useState(false);

  const helper = (arrayofobjects) => {
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

  // const helperSpender = (arrayofobjects) => {
  //   let filteredarray = [];
  //   arrayofobjects.forEach((object) => {
  //     filteredarray.push({
  //       value: object.id,
  //       label: object.name,
  //     });
  //   });
  //   return filteredarray;
  // };

  // get the list of users of the group from groupId params to populate splitby field
  const getGroupMembers = async () => {
    let group = await axios.get(
      `${process.env.REACT_APP_API_SERVER}/groups/${props.groupId}`
    );
    console.log("payer options: ", helper(group.data.users));
    console.log("spender options: ", helper(group.data.users));
    setPayerOptions(helper(group.data.users));
    setSpenderOptions(helper(group.data.users));
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

  const handleChangeSpenders = (event) => {
    const {
      target: { value },
    } = event;
    setSplitBy(
      // produces array of id e.g. [2,3,4]
      typeof value === "string" ? value.split(",") : value
    );
  };

  const createNewExpense = async (name, price, payerid, spenders) => {
    console.log("spenderrrrrrs: ", spenders);
    let newExpense = {
      name: name,
      amount: price,
      payerId: payerid,
      splitByIds: spenders,
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
        setOpenAlert(true);
        props.reloadAllExpenses();
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!(itemError || amountError || splitBy.length === 0 || payer === "")) {
      createNewExpense(item, amount, payer, splitBy);
      //cannot put reload function here. or it will run at the same time
    }
  };

  const handleCloseAlert = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenAlert(false);
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
        <FormControl required sx={{ m: 2, width: "80ch" }} variant="outlined">
          <InputLabel>Who paid?</InputLabel>
          <MuiSelect
            value={payer}
            label="Who paid?"
            onChange={(e) => {
              setPayer(e.target.value);
            }}
          >
            {payerOptions.map((person) => (
              <MenuItem key={person.userId} value={person.userId}>
                {person.name}
              </MenuItem>
            ))}
          </MuiSelect>
        </FormControl>
      </center>
      <center>
        <FormControl required sx={{ m: 2, width: "80ch" }}>
          <InputLabel>Split with?</InputLabel>
          <MuiSelect
            multiple
            value={splitBy}
            onChange={handleChangeSpenders}
            input={<OutlinedInput label="Split with?" />}
            MenuProps={MenuProps}
          >
            {spenderOptions.map((user) => (
              <MenuItem
                key={user.userId}
                value={user.userId}
                style={getStyles(user.userId, splitBy, theme)}
              >
                {user.name}
              </MenuItem>
            ))}
          </MuiSelect>
        </FormControl>
        {console.log("what is splitby? ", splitBy)}
      </center>
      <br />
      <center>
        <IconButton size="large" onClick={handleSubmit}>
          <AddCircleOutlinedIcon color="primary" sx={{ fontSize: 40 }} />
        </IconButton>
      </center>
      <Snackbar
        open={openAlert}
        autoHideDuration={2000}
        onClose={handleCloseAlert}
      >
        <Alert
          onClose={handleCloseAlert}
          severity="success"
          sx={{ width: "100%" }}
        >
          <AlertTitle>Success</AlertTitle>
          Expense added.
        </Alert>
      </Snackbar>
    </div>
  );
}
