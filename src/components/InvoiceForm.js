import React, { useEffect, useState } from "react";

// Placeholder contactlist for selection purposes
// import { contactList } from "../data";

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
import { Card, CardContent, Container, FormControl } from "@mui/material";
import axios from "axios";
import { useParams } from "react-router-dom";

const steps = ["Add Title & Date"];

export default function InvoiceForm(props) {
  //props.currentUser properties passed from currentUser state in App.js
  //author is an object, same as currentUser {displayName: "", email:""}

  let { groupId } = useParams();

  const [currentGroupData, setCurrentGroupData] = useState(""); //why will this not work if it's initiated as {} instead of ""

  // maybe i dun need these 3 below but i can put them inside the detailed invoice display?
  // =====================================================
  // const [chooseMembers, setChooseMembers] = useState([]);
  const helper = (arrayofobjects) => {
    let filteredarray = [];
    arrayofobjects.forEach((object) => {
      filteredarray.push({
        value: object.email,
        label: object.name,
      });
    });
    return filteredarray;
  };

  const getGroupMembers = async () => {
    let group = await axios.get(
      `${process.env.REACT_APP_API_SERVER}/groups/${groupId}`
    );
    console.log("current active group: ", helper(group.data.users));
    setCurrentGroupData(group.data);
    // setChooseMembers(helper(group.data.users));
  };

  useEffect(() => {
    getGroupMembers();
  }, [groupId]);
  // ======================================================

  const [invoice, setInvoice] = useState("");
  // const [author, setAuthor] = useState({
  //   username: props.currentUser.name,
  //   email: props.currentUser.email,
  // });
  const [date, setDate] = useState(dayjs());

  // the list of selectedFriends will always include the author
  // this state is different from the "chooseMembers" state
  //... actually no need this what members from the group will be in the invoice
  // const [selectedFriends, setSelectedFriends] = useState([
  //   {
  //     value: props.currentUser.email,
  //     label: props.currentUser.name,
  //     isFixed: true,
  //   },
  // ]);

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

  // add the currentUser to the top of the contact list and set it as a default fixed option.

  // when currentUser change, replace the author and the first element of the selectedFriends to be the new currentUser.
  // useEffect(() => {
  //   setAuthor({
  //     username: props.currentUser.name,
  //     email: props.currentUser.email,
  //   });
  //   const newGroup = [...selectedFriends];
  //   newGroup[0] = {
  //     value: props.currentUser.email,
  //     label: props.currentUser.name,
  //     isFixed: true,
  //   };
  //   setSelectedFriends(newGroup);
  // }, [props.currentUser]);

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

  //  const handleNext = (e) => {
  //    e.preventDefault();
  //    if (activeStep === 0) {
  //      setActiveStep((prevActiveStep) => prevActiveStep + 1);
  //    } else if (activeStep === 1 && !titleError && date && date.isValid()) {
  //      const dbRef = push(databaseRef(database, "invoice"));
  //      set(dbRef, {
  //        invoice,
  //        author,
  //        date: date.format("DD/MM/YYYY"),
  //        group: selectedFriends,
  //      });
  //      setInvoice("");
  //      setDate(dayjs());
  //      setSelectedFriends([
  //        {
  //          value: props.currentUser.email,
  //          label: props.currentUser.displayName,
  //          isFixed: true,
  //        },
  //      ]);
  //      setActiveStep((prevActiveStep) => prevActiveStep + 1);
  //    }
  //  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  // const step1 = (
  //   <FormControl
  //     required
  //     sx={{ mt: 4, mb: 30, width: "100%" }}
  //     variant="standard"
  //   >
  //     <Select
  //       closeMenuOnSelect={false}
  //       options={chooseMembers}
  //       value={selectedFriends}
  //       defaultValue={chooseMembers[0]}
  //       onChange={setSelectedFriends}
  //       isSearchable={true}
  //       isMulti
  //       styles={{
  //         multiValue: (base, state) => {
  //           return state.data.isFixed
  //             ? { ...base, backgroundColor: "gray" }
  //             : base;
  //         },
  //         multiValueLabel: (base, state) => {
  //           return state.data.isFixed
  //             ? {
  //                 ...base,
  //                 fontWeight: "bold",
  //                 color: "white",
  //                 paddingRight: 6,
  //               }
  //             : base;
  //         },
  //         multiValueRemove: (base, state) => {
  //           return state.data.isFixed ? { ...base, display: "none" } : base;
  //         },
  //       }}
  //     />
  //   </FormControl>
  // );

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
