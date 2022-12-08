import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import { ref as databaseRef, onValue } from "firebase/database";
import { database } from "../firebase";
import InvoiceCard from "./InvoiceCard";
import { Link } from "react-router-dom";

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
    <div>
      <nav>
        <Link to={`/invoices/createinvoice`}>
          <button>+ New Invoice</button>
        </Link>
      </nav>
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
          <p>No records 🎉. Split-A-Bill to begin.</p>
        )}
      </Box>
    </div>
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
