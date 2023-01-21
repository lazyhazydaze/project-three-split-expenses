import React, { useState, useEffect } from "react";
import InvoiceCard from "./InvoiceCard";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Box, Container, Button, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Sidebar from "./Sidebar";
import axios from "axios";

//to retrieve and display the invoices onto the homepage

export default function InvoiceRetrieve(props) {
  let { groupId } = useParams();

  const [invoiceList, setInvoiceList] = useState([]);

  const getInvoiceList = async () => {
    let invoiceList = await axios.get(
      `${process.env.REACT_APP_API_SERVER}/invoices/group/${groupId}`
    );
    console.log("invoice list: ", invoiceList.data);
    setInvoiceList(invoiceList.data);
  };

  useEffect(() => {
    getInvoiceList();
  }, [groupId]);

  const navigate = useNavigate();

  return (
    <Container sx={{ maxWidth: { xl: 1280 } }}>
      <Box mt={2} display="flex">
        <Sidebar currentUser={props.currentUser} />
        <Box flex="1">
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
              to={`/group/${groupId}/createinvoice`}
            >
              New Invoice
            </Button>
          </Box>

          <Box display="flex" flexWrap="wrap" width="100%" gap={1}>
            {invoiceList.length > 0 ? (
              invoiceList.map((invoice) => (
                <InvoiceCard
                  groupid={groupId}
                  invoiceid={invoice.id}
                  name={invoice.name}
                  date={invoice.date.slice(0, 10)}
                  author={invoice.author}
                  deleterights={
                    props.currentUser.email === invoice.author.email
                  }
                  key={invoice.id}
                  idvalue={invoice.id}
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
                  Welcome {props.currentUser.name}.
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
        </Box>
      </Box>
    </Container>
  );
}
