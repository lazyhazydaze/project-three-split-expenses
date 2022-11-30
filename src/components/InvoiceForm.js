import React, { useState } from "react";

export default function InvoiceForm(props) {
  const [invoice, setInvoice] = useState("");
  const [author, setAuthor] = useState("");
  const [date, setDate] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    props.updateInvoice(invoice);
    props.updateAuthor(author);
    props.updateDate(date);
    setInvoice("");
    setAuthor("");
    setDate("");
  };

  return (
    <div>
      <h4>1B. Name this invoice</h4>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="invoice"
          value={invoice}
          placeholder="Enter Invoice Name"
          onChange={({ target }) => setInvoice(target.value)}
          required
        />
        <input
          type="text"
          name="author"
          value={author}
          placeholder="Enter Author Name"
          onChange={({ target }) => setAuthor(target.value)}
          required
        />
        <input
          type="text"
          name="date"
          value={date}
          placeholder="Enter Date"
          onChange={({ target }) => setDate(target.value)}
          required
        />
        <br />
        <input type="submit" value="Next" />
      </form>

      <p>Invoice name : {props.invoiceDisplay}</p>
      <p>Author : {props.authorDisplay} </p>
      <p>Date : {props.dateDisplay} </p>
    </div>
  );
}
