import React, { useState, useEffect } from "react";
import { ref as databaseRef, onValue } from "firebase/database";
import { database } from "../firebase";
import InvoiceDisplay from "./InvoiceDisplay";

export default function InvoiceRetrieve(props) {
  const [invoiceList, setInvoiceList] = useState([]);

  useEffect(() => {
    const db = databaseRef(database, "invoice");
    onValue(db, (snapshot) => {
      setInvoiceList(snapshot.val());
      //console.log("snapshot.val()", snapshot.val());
    });
  }, []);

  return (
    <div className="row-flex">
      {invoiceList ? (
        Object.keys(invoiceList).map((entry) => (
          <InvoiceDisplay
            {...invoiceList[entry]}
            key={entry}
            idvalue={entry}
            clickMe={() => {
              props.setCurrentRecordListener(entry);
            }}
          />
        ))
      ) : (
        <p>[No invoices to be displayed.]</p>
      )}
    </div>
  );
}
