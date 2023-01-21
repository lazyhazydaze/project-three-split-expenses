import React, { useState } from "react";

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
import { Card, CardContent, Container } from "@mui/material";
import axios from "axios";
import { useParams } from "react-router-dom";

const steps = ["Add Title & Date"];

export default function InvoiceForm(props) {
  //props.currentUser properties passed from currentUser state in App.js
  //author is an object, same as currentUser {displayName: "", email:""}

  let { groupId } = useParams();

  //const [currentGroupData, setCurrentGroupData] = useState(""); //why will this not work if it's initiated as {} instead of ""

  // maybe i dun need these 3 below but i can put them inside the detailed invoice display?
  // =====================================================
  // const [chooseMembers, setChooseMembers] = useState([]);
  // const helper = (arrayofobjects) => {
  //   let filteredarray = [];
  //   arrayofobjects.forEach((object) => {
  //     filteredarray.push({
  //       value: object.email,
  //       label: object.name,
  //     });
  //   });
  //   return filteredarray;
  // };

  // const getGroupMembers = async () => {
  //   let group = await axios.get(
  //     `${process.env.REACT_APP_API_SERVER}/groups/${groupId}`
  //   );
  //   console.log("current active group: ", helper(group.data.users));
  //   setCurrentGroupData(group.data);
  //   // setChooseMembers(helper(group.data.users));
  // };

  // useEffect(() => {
  //   getGroupMembers();
  // }, [groupId]);
  // ======================================================

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
    <Container sx={{ maxWidth: { xl: 800 } }}>
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
                  Invoice created! Click on Invoices to edit the record.
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
  );
}
