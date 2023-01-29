import React, { useState, useEffect } from "react";

// Libraries for styling
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
import {
  Card,
  CardContent,
  Container,
  Link as MuiLink,
  Toolbar,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios from "axios";
import { Link, useParams } from "react-router-dom";

const steps = ["Add Title & Date"];

export default function InvoiceForm(props) {
  //props.currentUser properties passed from currentUser state in App.js
  //author is an object, same as currentUser {displayName: "", email:""}

  let { groupId } = useParams();
  const [groupName, setGroupName] = useState("");
  //const [currentGroupData, setCurrentGroupData] = useState(""); //why will this not work if it's initiated as {} instead of "". Because empty object is still taken as empty object so it will still try to retrieve an empty object.

  const getGroupName = async () => {
    let group = await axios.get(
      `${process.env.REACT_APP_API_SERVER}/groups/${groupId}`
    );
    console.log("current active group: ", group.data.name);
    setGroupName(group.data.name);
  };

  useEffect(() => {
    getGroupName();
  }, [groupId]);

  const [invoice, setInvoice] = useState("");
  const [date, setDate] = useState(dayjs());

  // members from the group will be in the invoice automatically

  const [titleError, setTitleError] = useState(true);
  const [titleErrorMessage, setTitleErrorMessage] = useState(
    "Field cannot be blank."
  );

  const validateTitle = (titleValue) => {
    if (titleValue === "") {
      setTitleError(true);
      setTitleErrorMessage("Field cannot be blank.");
    } else if (titleValue.length > 30) {
      setTitleError(true);
      setTitleErrorMessage(
        `Max 30 char (Current: ${titleValue.length} char). `
      );
    } else {
      setTitleError(false);
    }
    setInvoice(titleValue);
  };

  const createNewInvoice = async (name, date) => {
    let newInvoice = {
      name: name,
      date: date,
      authorId: props.currentUser.id,
    };
    await axios
      .post(
        `${process.env.REACT_APP_API_SERVER}/invoices/group/${groupId}`,
        newInvoice
      )
      .then((response) => {
        console.log("create invoice response", response.data);
        setInvoice("");
        setDate(dayjs());
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      });
  };

  const [activeStep, setActiveStep] = useState(0);

  // On submit, invoice is created in db.
  const handleNext = (e) => {
    e.preventDefault();
    console.log("a", activeStep);
    if (activeStep === 0 && !titleError && date && date.isValid()) {
      console.log("b", activeStep);
      createNewInvoice(invoice, date);
      // setActiveStep((prevActiveStep) => prevActiveStep + 1);
    } else if (activeStep === 1) {
      console.log("c", activeStep);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const step2 = (
    <Box
      sx={{
        mt: 5,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-evenly",
      }}
    >
      <TextField
        required
        label="Title"
        value={invoice}
        onChange={({ target }) => validateTitle(target.value)}
        error={titleError}
        helperText={titleError && titleErrorMessage}
      />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DesktopDatePicker
          label="Date*"
          inputFormat="DD/MM/YYYY"
          value={date}
          onChange={(newValue) => setDate(newValue)}
          renderInput={(params) => <TextField {...params} />}
        />
      </LocalizationProvider>
    </Box>
  );

  const stepForm = [step2];

  return (
    <>
      <Toolbar />
      <Container sx={{ maxWidth: { xl: 800 } }}>
        <MuiLink
          underline="none"
          component={Link}
          to={`/group/${groupId}/invoices`}
        >
          <Button component="a" startIcon={<ArrowBackIcon fontSize="small" />}>
            Back to Group: {groupName}
          </Button>
        </MuiLink>
        <Box my={10}>
          <Card>
            <CardContent>
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
                    Invoice created! Go back to group to edit.
                  </Typography>
                  <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                    <Box sx={{ flex: "1 1 auto" }} />
                    <Button onClick={handleReset}>Create another</Button>
                  </Box>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <Typography sx={{ mt: 2, mb: 1 }}>
                    {stepForm[activeStep]}
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
            </CardContent>
          </Card>
        </Box>
      </Container>
    </>
  );
}
