import React, { useState } from "react";
import { ref as databaseRef, remove } from "firebase/database";
import { database } from "../firebase";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Container,
  Card,
  CardContent,
} from "@mui/material";

import ExpenseCard from "./ExpenseCard";
import ExpenseForm from "./ExpenseForm";
import ReceiptDisplay from "./ReceiptDisplay";

/****************************************************************/
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
/****************************************************************/

export default function DetailedInvoiceDisplay(props) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const clearRecords = () => {
    const db = databaseRef(
      database,
      "invoice/" + props.currentKey + "/expenses"
    );
    remove(db);
  };

  const addButton = (
    <center>
      {props.currentRecord.author &&
        props.currentRecord.author.email === props.currentUser.email && (
          <span>
            <Button
              variant="contained"
              size="medium"
              startIcon={<AddIcon />}
              onClick={handleClickOpen}
            >
              Add Expense
            </Button>
            <Dialog maxWidth="md" fullWidth open={open} onClose={handleClose}>
              <DialogContent>
                <ExpenseForm
                  keyval={props.currentKey}
                  fullNameList={
                    props.currentRecord.group ? props.currentRecord.group : []
                  }
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose}>Close</Button>
              </DialogActions>
            </Dialog>
          </span>
        )}
    </center>
  );

  const clearAllButton = (
    <center>
      {props.currentRecord &&
        props.currentRecord.expenses &&
        props.currentRecord.author.email === props.currentUser.email && (
          <Button
            variant="outlined"
            size="small"
            startIcon={<DeleteForeverIcon />}
            onClick={clearRecords}
          >
            Clear All
          </Button>
        )}
    </center>
  );

  const displayAllExpenses = (
    <Box>
      <List>
        {props.currentRecord.expenses &&
          Object.keys(props.currentRecord.expenses).map((entry) => (
            <ExpenseCard
              {...props.currentRecord.expenses[entry]}
              invoicekey={props.currentKey}
              expensekey={entry}
              deleterights={
                props.currentRecord.author.email === props.currentUser.email
              }
            />
          ))}
      </List>
    </Box>
  );

  const displaySplitBill = (
    <div>
      {props.currentRecord.expenses ? (
        <div>
          {props.currentRecord.group && (
            <Box>
              <List>
                {props.currentRecord.group.map(
                  (contact) =>
                    props.overallReceipt[contact.value] && (
                      <ReceiptDisplay
                        name={contact}
                        receipt={props.overallReceipt[contact.value]}
                      />
                    )
                )}
              </List>
            </Box>
          )}
        </div>
      ) : (
        <center>
          <h4>Nothing to split. Add a new expense to begin.</h4>
        </center>
      )}
    </div>
  );

  return (
    <div>
      <Container sx={{ maxWidth: { xl: 980 } }}>
        <Box mt={2}>
          <Card>
            <CardContent>
              <Box display="flex" mb={1}>
                <Box ml={2} flex="1">
                  <Typography variant="h5">
                    {props.currentRecord.invoice}
                  </Typography>
                  <Typography variant="body2">
                    {props.currentRecord.date}, by{"  "}
                    {props.currentRecord.author &&
                      props.currentRecord.author.username}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ width: "100%" }}>
                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                  <Tabs
                    value={value}
                    onChange={handleChange}
                    aria-label="basic tabs example"
                  >
                    <Tab label="Expenses" {...a11yProps(0)} />
                    <Tab
                      label={
                        props.currentRecord.group &&
                        props.currentRecord.group.length === 1
                          ? "1 Member"
                          : `${props.currentRecord.group.length} Members`
                      }
                      {...a11yProps(1)}
                    />
                    <Tab label="Split Bill" {...a11yProps(2)} />
                  </Tabs>
                </Box>

                <TabPanel value={value} index={0}>
                  {addButton}
                  <br />
                  {displayAllExpenses}
                  <br />
                  {clearAllButton}
                </TabPanel>

                <TabPanel value={value} index={1}>
                  <ContactsIterator currentRecord={props.currentRecord} />
                </TabPanel>

                <TabPanel value={value} index={2}>
                  {displaySplitBill}
                </TabPanel>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </div>
  );
}

const ContactsIterator = (props) => {
  return (
    <Box>
      <List>
        {props.currentRecord.group &&
          props.currentRecord.group.map((contact) => (
            <ListItem>
              <ListItemAvatar>pfp</ListItemAvatar>
              <ListItemText
                primary={`${contact.label}`}
                secondary={<>{contact.value}</>}
              />
            </ListItem>
          ))}
      </List>
    </Box>
  );
};

// <div>
//   {props.currentRecord.group &&
//     props.currentRecord.group.map((contact, i) => <div>{contact.label}</div>)}
// </div>;
