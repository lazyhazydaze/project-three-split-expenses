import React, { useState } from "react";
import { Paper, Typography, Link as MuiLink, Box } from "@mui/material";
import ContactsIcon from "@mui/icons-material/AccountCircle";
import { Link } from "react-router-dom";
import ClearIcon from "@mui/icons-material/Clear";
import IconButton from "@mui/material/IconButton";

export default function InvoiceCard(props) {
  const [elevation, setElevation] = useState(1);
  //idvalue properties is passed from InvoiceRetrieve.js, which is the key of the Invoice in db.
  //clickMe properties
  //deleterights properties
  //expensekey properties
  const deleteInvoice = (e) => {
    e.preventDefault();
    console.log("add a delete route for invoice");
  };
  return (
    <MuiLink
      component={Link}
      to={`/group/${props.groupid}/invoice/${props.invoiceid}`}
      underline="none"
      onMouseEnter={() => setElevation(3)}
      onMouseLeave={() => setElevation(1)}
      //onClick={props.clickMe}
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
              // <button value={props.expensekey} onClick={deleteInvoice}>
              //   ✖
              // </button>
              <IconButton
                aria-label="delete"
                value={props.expensekey}
                onClick={deleteInvoice}
                size="small"
              >
                <ClearIcon fontSize="inherit" />
              </IconButton>
            )}
          </Box>
        </Box>
      </Paper>
    </MuiLink>
  );
}

// <div id={props.idvalue} onClick={props.clickMe}>
//   <div className="card">
//     <h3>{props.invoice}</h3>
//     <p>{props.date}</p>
//     <p>By: {props.author.username}</p>
//     {props.deleterights && (
//       <button value={props.expensekey} onClick={deleteInvoice}>
//         ✖
//       </button>
//     )}
//   </div>
// </div>
