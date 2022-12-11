import React, { useState, useEffect } from "react";
import { ref as databaseRef, onValue } from "firebase/database";
import { database } from "../firebase";
import InvoiceCard from "./InvoiceCard";
import { Link } from "react-router-dom";
import { Box, Container, Button, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

//to retrieve and display the invoices onto the homepage
//properties currentUser and setCurrentRecordListener are passed from App.js

export default function InvoiceRetrieve(props) {
  const [invoiceList, setInvoiceList] = useState({});
  useEffect(() => {
    const db = databaseRef(database, "invoice");
    onValue(db, (snapshot) => {
      if (snapshot.val()) {
        setInvoiceList(snapshot.val());
      } else {
        setInvoiceList({});
      }

      console.log("snapshot.val()", snapshot.val());
    });
  }, []);

  const [filteredInvoiceList, setFilteredInvoiceList] = useState({});

  useEffect(() => {
    const filteredInvoice = {};
    for (const [invoiceKey, invoice] of Object.entries(invoiceList)) {
      const groupObject = invoice.group;
      // groupObject is an array of objects [{ }, { }, { }, { }...,{ }]
      groupObject.forEach((friend) => {
        if (friend.value === props.currentUser.email) {
          filteredInvoice[invoiceKey] = invoice;
        }
      });
    }
    setFilteredInvoiceList(filteredInvoice);
  }, [invoiceList, props.currentUser]);

  return (
    <Container sx={{ maxWidth: { xl: 1280 } }}>
      <Box
        mt={3}
        pb={1}
        width="100%"
        sx={{
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Button
          variant="contained"
          size="small"
          startIcon={<AddIcon />}
          component={Link}
          to={`/invoices/createinvoice`}
        >
          New Invoice
        </Button>
      </Box>

      <Box display="flex" flexWrap="wrap" width="100%" gap={1}>
        {Object.keys(filteredInvoiceList).length > 0 ? (
          Object.keys(filteredInvoiceList).map((entry) => (
            <InvoiceCard
              {...filteredInvoiceList[entry]}
              deleterights={
                props.currentUser.email ===
                filteredInvoiceList[entry].author.email
              }
              key={entry}
              idvalue={entry}
              clickMe={() => {
                props.setCurrentRecordListener(entry);
              }}
            />
          ))
        ) : (
          <Container component="main" sx={{ mt: 8, mb: 2 }} maxWidth="sm">
            <Typography
              sx={{ fontWeight: "bold", color: "#132F4C" }}
              variant="h2"
              component="h1"
              gutterBottom
            >
              Welcome {props.currentUser.displayName}.
            </Typography>
            <Typography
              sx={{ fontWeight: "medium", color: "#007FFF" }}
              variant="h5"
              component="h2"
              gutterBottom
            >
              {"There's nothing here."}
              <br />
              {"Click on + New Invoice to get started."}
            </Typography>
          </Container>
        )}
      </Box>
    </Container>
  );
}

// {
//   /* <div className="row-flex">
//         {Object.keys(filteredInvoiceList).length > 0 ? (
//           Object.keys(filteredInvoiceList).map((entry) => (
//             <InvoiceCard
//               {...filteredInvoiceList[entry]}
//               deleterights={
//                 props.currentUser.email ===
//                 filteredInvoiceList[entry].author.email
//               }
//               key={entry}
//               idvalue={entry}
//               clickMe={() => {
//                 props.setCurrentRecordListener(entry);
//               }}
//             />
//           ))
//         ) : (
//           <p>No records 🎉. Split-A-Bill to begin.</p>
//         )}
//       </div> */
// }
