import React, { useEffect, useState } from "react";

// Libraries for styling
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import EditIcon from "@mui/icons-material/Edit";
import { Box, IconButton } from "@mui/material";

import axios from "axios";

export default function EditInvoiceForm(props) {
  const [invoiceName, setInvoiceName] = useState("");
  const [invoiceDate, setInvoiceDate] = useState(dayjs());

  const [titleError, setTitleError] = useState(true);
  const [titleErrorMessage, setTitleErrorMessage] = useState(
    "Field cannot be blank."
  );

  useEffect(() => {
    validateTitle(props.invoicename);
    console.log("neck hurts", invoiceName);
    setInvoiceDate(dayjs());
  }, []);

  const validateTitle = (titleValue) => {
    if (titleValue === "") {
      setTitleError(true);
      setTitleErrorMessage("Field cannot be blank.");
    } else if (titleValue.length > 30) {
      setTitleError(true);
      setTitleErrorMessage(
        `Max 30 char (Current: ${titleValue.length} char). `
      );
    } else {
      setTitleError(false);
    }
    setInvoiceName(titleValue);
  };

  const [open, setOpen] = useState(false);

  const handleClickOpen = (e) => {
    e.preventDefault();
    console.log("handle clicl open");
    setOpen(true);
  };

  const handleClose = (e) => {
    e.preventDefault();
    setOpen(false);
  };

  const editInvoice = async (nameInput, dateInput) => {
    let updatedInvoice = {
      name: nameInput,
      date: dateInput,
    };
    await axios
      .put(
        `${process.env.REACT_APP_API_SERVER}/invoices/invoice/${props.invoiceid}`,
        updatedInvoice
      )
      .then((response) => {
        console.log("edited invoice response: ", response.data);
        props.refreshList();
      });
  };

  const submitEditInvoice = (e) => {
    e.preventDefault();
    console.log("I can edit here yeees!");
    editInvoice(invoiceName, invoiceDate).then(setOpen(false));
  };

  return (
    <span
      onClick={(e) => {
        e.preventDefault();
      }}
    >
      <IconButton size="small" onClick={handleClickOpen}>
        <EditIcon fontSize="inherit" />
      </IconButton>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit this Invoice</DialogTitle>
        <DialogContent>
          <Box
            sx={{
              mt: 5,
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-evenly",
            }}
          >
            <TextField
              required
              label="Title"
              value={invoiceName}
              onChange={({ target }) => validateTitle(target.value)}
              error={titleError}
              helperText={titleError && titleErrorMessage}
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DesktopDatePicker
                label="Date*"
                inputFormat="DD/MM/YYYY"
                value={invoiceDate}
                onChange={(newValue) => setInvoiceDate(newValue)}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={submitEditInvoice}>Edit</Button>
        </DialogActions>
      </Dialog>
    </span>
  );
}
