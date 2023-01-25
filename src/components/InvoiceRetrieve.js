import React, { useState, useEffect } from "react";
import InvoiceCard from "./InvoiceCard";
import { Link, useParams } from "react-router-dom";
import {
  Avatar,
  AvatarGroup,
  Box,
  Container,
  Button,
  Typography,
  Stack,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SavingsIcon from "@mui/icons-material/Savings";
import axios from "axios";

//to retrieve and display the invoices onto the homepage

export default function InvoiceRetrieve(props) {
  let { groupId } = useParams();

  const [invoiceList, setInvoiceList] = useState([]);
  const [currentGroupName, setCurrentGroupName] = useState("");
  const [groupMembers, setGroupMembers] = useState([]);

  const getInvoiceList = async () => {
    let invoiceList = await axios.get(
      `${process.env.REACT_APP_API_SERVER}/invoices/group/${groupId}`
    );
    console.log("invoice list: ", invoiceList.data);
    setInvoiceList(invoiceList.data);
  };

  const getCurrentGroupData = async () => {
    let response = await axios.get(
      `${process.env.REACT_APP_API_SERVER}/groups/${groupId}`
    );
    setCurrentGroupName(response.data.name);
    setGroupMembers(response.data.users);
  };

  useEffect(() => {
    getInvoiceList();
    getCurrentGroupData();
  }, [groupId]);

  return (
    <div>
      {/* Hero unit */}
      <Box
        sx={{
          bgcolor: "background.paper",
          pt: 8,
          pb: 6,
        }}
      >
        <Container maxWidth="sm">
          <Typography
            variant="h3"
            align="center"
            color="text.primary"
            gutterBottom
          >
            {currentGroupName}
          </Typography>
          <Typography
            variant="h5"
            align="center"
            color="text.secondary"
            paragraph
          >
            {groupMembers.length} Members
          </Typography>
          <AvatarGroup
            style={{ justifyContent: "center", display: "flex" }}
            max={4}
          >
            {groupMembers.length > 0 &&
              groupMembers.map((member) => (
                <Avatar alt={member.name} src={member.picture} />
              ))}
          </AvatarGroup>
          <Stack
            sx={{ pt: 4 }}
            direction="row"
            spacing={2}
            justifyContent="center"
          >
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              component={Link}
              to={`/group/${groupId}/createinvoice`}
            >
              New Invoice
            </Button>
            <Button
              variant="outlined"
              startIcon={<SavingsIcon />}
              component={Link}
              to={`/group/${groupId}/settle`}
            >
              Settle It
            </Button>
          </Stack>
        </Container>
      </Box>
      {/* End hero unit */}

      <Container sx={{ maxWidth: { xl: 1280 } }}>
        <Box mt={2} display="flex">
          <Box flex="1">
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
                <Container sx={{ mb: 2 }} maxWidth="sm">
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
    </div>
  );
}
