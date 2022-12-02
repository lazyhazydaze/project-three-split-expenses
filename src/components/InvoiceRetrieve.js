import React, { useState, useEffect } from "react";
import { ref as databaseRef, onValue } from "firebase/database";
import { database } from "../firebase";
import InvoiceDisplay from "./InvoiceDisplay";

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
    for (const [key, value] of Object.entries(invoiceList)) {
      if (value.group.includes(props.currentUser)) {
        filteredInvoice[key] = value;
      }
    }
    setFilteredInvoiceList(filteredInvoice);
  }, [invoiceList, props.currentUser]);

  return (
    <div className="row-flex">
      {Object.keys(filteredInvoiceList).length > 0 ? (
        Object.keys(filteredInvoiceList).map((entry) => (
          <InvoiceDisplay
            {...filteredInvoiceList[entry]}
            deleterights={
              props.currentUser === filteredInvoiceList[entry].author
            }
            key={entry}
            idvalue={entry}
            clickMe={() => {
              props.setCurrentRecordListener(entry);
            }}
          />
        ))
      ) : (
        <p>
          No records 🎉. Click <button>Split the bill</button> to start.
        </p>
      )}
    </div>
  );
}
