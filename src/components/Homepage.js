import React from "react";

import { Container } from "@mui/material";

export default function Homepage(props) {
  return (
    
      <Container sx={{ maxWidth: { xl: 1280 } }}>
      <h1>
        Welcome, {props.username.displayName} <br />
        <br /> - Add dashboard here later. <br /> - Retrieve pfp photourl from
        database <br /> - AccPopover menu: make logout and edit profile
        functional <br /> - InvoiceForm names dropdown keep closing after i
        click a name <br /> - What is MUILink? (from InvoiceDisplay) <br /> -
        Change the Nav Bar Icon <br /> - Render the profile pic under members in
        detailed invoice display <br /> - Why refresh the detailedinvoicepage
        will be blank page?
      </h1>
    </Container>
  );
}
