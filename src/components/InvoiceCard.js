import React, { useState } from "react";
import {
  Paper,
  Typography,
  Link as MuiLink,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import ContactsIcon from "@mui/icons-material/AccountCircle";
import { Link } from "react-router-dom";
import ClearIcon from "@mui/icons-material/Clear";
import IconButton from "@mui/material/IconButton";
import axios from "axios";
import EditInvoiceForm from "./EditInvoiceForm";

export default function InvoiceCard(props) {
  const [elevation, setElevation] = useState(1);
  // properties is passed from InvoiceRetrieve.js, which is the key of the Invoice in db.

  const deleteInvoice = async () => {
    await axios
      .delete(`${process.env.REACT_APP_API_SERVER}/invoices/${props.invoiceid}`)
      .then((response) => {
        console.log("delete invoice response: ", response.data);
        props.refreshInvoiceList();
      });
  };

  return (
    <MuiLink
      component={Link}
      to={`/group/${props.groupid}/invoice/${props.invoiceid}`}
      underline="none"
      onMouseEnter={() => setElevation(3)}
      onMouseLeave={() => setElevation(1)}
    >
      <Paper
        sx={{
          height: 200,
          width: 195,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "1em",
        }}
        elevation={elevation}
      >
        <Box display="flex" flexDirection="column" alignItems="center">
          <Box textAlign="center" marginTop={1}>
            <Typography variant="subtitle2">{props.name}</Typography>
            <Typography variant="caption" color="textSecondary">
              {props.date}
            </Typography>
          </Box>
        </Box>
        <Box display="flex" justifyContent="space-around" width="100%">
          <Box display="flex" alignItems="center">
            <ContactsIcon color="disabled" sx={{ mr: 1 }} />
            <div>
              <Typography variant="subtitle2" sx={{ mb: -1 }}>
                {props.author.name}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                created this
              </Typography>
            </div>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {props.deleterights && (
              <span>
                <EditInvoiceForm
                  invoiceid={props.invoiceid}
                  invoicename={props.name}
                  refreshList={props.refreshInvoiceList}
                />
                <XButton deleteFunction={deleteInvoice} />
              </span>
            )}
          </Box>
        </Box>
      </Paper>
    </MuiLink>
  );
}

const XButton = (props) => {
  const [clearOpen, setClearOpen] = useState(false);

  return (
    <span
      onClick={(e) => {
        e.preventDefault();
      }}
    >
      <IconButton
        onClick={() => {
          setClearOpen(true);
        }}
        aria-label="delete"
        size="small"
      >
        <ClearIcon fontSize="inherit" />
      </IconButton>

      <Dialog
        open={clearOpen}
        onClose={() => {
          setClearOpen(false);
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm delete?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure? This action is irreversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setClearOpen(false);
            }}
          >
            No
          </Button>
          <Button
            onClick={() => {
              setClearOpen(false);
              props.deleteFunction();
            }}
            autoFocus
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </span>
  );
};
