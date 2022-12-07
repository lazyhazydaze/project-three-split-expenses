import React, { useEffect, useState } from "react";
import { ref as databaseRef, push, set } from "firebase/database";
import { database } from "../firebase";

// Placeholder contactlist for selection purposes
import { contactList } from "../data";

// Libraries for styling
import Select from "react-select";
import dayjs from "dayjs";
import TextField from "@mui/material/TextField";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";

import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

const steps = ["Add Group", "Name Your Invoice"];

const captions = ["Who is splitting with you?", "Add a name and date"];

export default function InvoiceForm(props) {
  //props.currentUser properties passed from currentUser state in App.js
  //author is an object, same as currentUser {displayName: "", email:""}

  const [invoice, setInvoice] = useState("");
  const [author, setAuthor] = useState(props.currentUser);
  const [date, setDate] = useState(dayjs());

  // the list of selectedFriends will always include the author
  const [selectedFriends, setSelectedFriends] = useState([
    {
      value: props.currentUser.email,
      label: props.currentUser.displayName,
      isFixed: true,
    },
  ]);

  // add the currentUser to the top of the contact list and set it as a default fixed option.
  let combinedContactList = [
    {
      value: props.currentUser.email,
      label: props.currentUser.displayName,
      isFixed: true,
    },
    ...contactList,
  ];

  // when currentUser change, replace the author and the first element of the selectedFriends to be the new currentUser.
  useEffect(() => {
    console.log("props",props.currentUser)
    // setAuthor(props.currentUser);
    setAuthor({
      username: props.currentUser.displayName,
      email: props.currentUser.email,
    })
    const newGroup = [...selectedFriends];
    newGroup[0] = {
      value: props.currentUser.email,
      label: props.currentUser.displayName,
      isFixed: true,
    };
    setSelectedFriends(newGroup);
  }, [props.currentUser]);

  const [activeStep, setActiveStep] = useState(0);

  // On submit, invoice (invoice name, author, date, selectedFriends as group) is pushed into db.
  const handleNext = () => {
    console.log("step",activeStep)
    if (activeStep === 1) {

      console.log("author",author)
      set(databaseRef(database,"invoice/"),{
        invoice,
        author, //this shit is breaking it
        date: date.format("DD/MM/YYYY"),
        group: selectedFriends,
      })
      console.log("woopdedoop")
      const dbRef = push(databaseRef(database, "invoice"));
      set(dbRef, {
        invoice,
        author,
        date: date.format("DD/MM/YYYY"),
        group: selectedFriends,
      });
      // console.log("past") stuck here
      setInvoice("");
      setDate(dayjs());
      setSelectedFriends([
        {
          value: props.currentUser.email,
          label: props.currentUser.displayName,
          isFixed: true,
        },
      ]);
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const step1 = (
    <div className="dropdown-container">
      <Select
        options={combinedContactList}
        placeholder="Select Name"
        value={selectedFriends}
        defaultValue={combinedContactList[0]}
        onChange={setSelectedFriends}
        isSearchable={true}
        isMulti
        styles={{
          multiValue: (base, state) => {
            return state.data.isFixed
              ? { ...base, backgroundColor: "gray" }
              : base;
          },
          multiValueLabel: (base, state) => {
            return state.data.isFixed
              ? {
                  ...base,
                  fontWeight: "bold",
                  color: "white",
                  paddingRight: 6,
                }
              : base;
          },
          multiValueRemove: (base, state) => {
            return state.data.isFixed ? { ...base, display: "none" } : base;
          },
        }}
      />
    </div>
  );

  const step2 = (
    <span>
      <input
        type="text"
        name="invoice"
        value={invoice}
        placeholder="Enter Invoice Name"
        onChange={({ target }) => setInvoice(target.value)}
        required
      />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DesktopDatePicker
          label="Date"
          inputFormat="MM/DD/YYYY"
          value={date}
          onChange={(newValue) => setDate(newValue)}
          renderInput={(params) => <TextField {...params} />}
        />
      </LocalizationProvider>
    </span>
  );

  const stepForm = [step1, step2];

  return (
    <div>
      <Box sx={{ width: "100%" }}>
        <Stepper activeStep={activeStep}>
          {steps.map((label, index) => {
            const stepProps = {};
            const labelProps = {};

            return (
              <Step key={label} {...stepProps}>
                <StepLabel {...labelProps}>{label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>
        {activeStep === steps.length ? (
          <React.Fragment>
            <Typography sx={{ mt: 2, mb: 1 }}>
              Invoice created! Go to Homepage to edit the record.
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
              <Box sx={{ flex: "1 1 auto" }} />
              <Button onClick={handleReset}>Create another</Button>
            </Box>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Typography sx={{ mt: 2, mb: 1 }}>
              {captions[activeStep]} <br /> {stepForm[activeStep]}
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
              <Button
                color="inherit"
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1 }}
              >
                Back
              </Button>
              <Box sx={{ flex: "1 1 auto" }} />

              <Button onClick={handleNext}>
                {activeStep === steps.length - 1 ? "Submit" : "Next"}
              </Button>
            </Box>
          </React.Fragment>
        )}
      </Box>
    </div>
  );
}
