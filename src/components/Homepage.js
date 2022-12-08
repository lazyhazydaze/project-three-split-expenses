import React from "react";

export default function Homepage(props) {
  return (
    <div>
      <h1>
        Welcome, {props.username.displayName} <br />
        <br /> - Add dashboard here later. <br /> - Retrieve pfp photourl from
        database <br /> - AccPopover menu: make logout and edit profile
        functional <br /> - InvoiceForm names dropdown keep closing after i
        click a name <br /> - What is MUILink? (from InvoiceDisplay) <br />{" "}
        - Change the Nav Bar Icon <br />
      </h1>
    </div>
  );
}
