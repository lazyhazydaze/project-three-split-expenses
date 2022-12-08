import { Routes, Route, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { ref as databaseRef, onValue } from "firebase/database";
import { database } from "./firebase";
import "./App.css";
import { auth } from "./firebase";
import { onAuthStateChanged } from "@firebase/auth";

import Header from "./components/Header";
import InvoiceForm from "./components/InvoiceForm";
import InvoiceRetrieve from "./components/InvoiceRetrieve";
import DetailedInvoiceDisplay from "./components/DetailedInvoiceDisplay";
import Homepage from "./components/Homepage";

import { Login } from "./components/Login";
import { Register } from "./components/Register";
import { Friendpage } from "./components/Friendpage";
import { UserProfile } from "./components/UserProfile";

export default function App() {
  // When user logs in, currentUser state is set with username and email.
  // For now, input fields with handleChange function is used as a placeholder.
  // When integrate with Firebase auth, can retrieve from Auth database and set it to currentUser
  const [currentUser, setCurrentUser] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        let dontbeconfusedhazelle = auth.currentUser;
        setCurrentUser(dontbeconfusedhazelle);
        // console.log("logged in")
        // console.log("dashboard",user)
      } else {
        // console.log("not logged in")
        navigate("/Login");
      }
      return () => {
        unsubscribe();
      };
    });
  }, []); //run once on render

  // const [currentUser, setCurrentUser] = useState({
  //   username: user? user.displayName : "thing",
  //   email: user? user.email : "thing",
  // });

  // currentRecord state is an object, refers to the invoice, which houses author, date, name of the invoice, and group of selected friends.

  const [currentRecord, setCurrentRecord] = useState({});
  const [currentKey, setCurrentKey] = useState("");

  const setCurrentRecordListener = (keyval) => {
    setCurrentKey(keyval);
    const db = databaseRef(database, "invoice/" + keyval);
    onValue(db, (snapshot) => {
      if (snapshot.val()) {
        setCurrentRecord(snapshot.val());
      } else {
        setCurrentRecord({});
        setCurrentKey("");
      }
    });
  };

  useEffect(() => {
    splitBill();
  }, [currentRecord]);

  useEffect(() => {
    setCurrentRecord({});
    setCurrentKey("");
  }, [currentUser]);

  const [overallReceipt, setOverallReceipt] = useState({});

  const splitBill = () => {
    if ("expenses" in currentRecord) {
      let newReceipt = {};
      for (let k = 0; k < currentRecord.group.length; k++) {
        let purchase = [];
        let cost = [];
        let initialValue = 0;
        for (const [key, value] of Object.entries(currentRecord.expenses)) {
          const splitByArray = value.splitBy;
          splitByArray.forEach((element) => {
            if (element.value === currentRecord.group[k].value) {
              purchase.push(value.item);
              cost.push(value.amount / value.splitBy.length);
            }
          });

          var record = {
            username: currentRecord.group[k].label,
            purchases: purchase,
            costprice: cost,
            total: cost.reduce(
              (previousValue, currentValue) => previousValue + currentValue,
              initialValue
            ),
          };
        }
        console.log("newReceipt", newReceipt);
        newReceipt[currentRecord.group[k].value] = record;
      }
      setOverallReceipt(newReceipt);
    } else {
      setOverallReceipt({});
    }
  };

  return (
    <div>
      <Routes>
        <Route path="Login" element={<Login />} />
        <Route path="Register" element={<Register />} />

        <Route path="/" element={<Header currentUser={currentUser} />}>
          <Route path="/" element={<Homepage username={currentUser} />} />
          <Route path="contacts" element={<Friendpage />} />
          <Route
            path="invoices"
            element={
              <InvoiceRetrieve
                currentUser={currentUser}
                setCurrentRecordListener={setCurrentRecordListener}
              />
            }
          />
          <Route
            path="invoices/:invoiceId"
            element={
              <DetailedInvoiceDisplay
                currentRecord={currentRecord}
                currentUser={currentUser}
                currentKey={currentKey}
                overallReceipt={overallReceipt}
              />
            }
          />

          <Route
            path="invoices/createinvoice"
            element={<InvoiceForm currentUser={currentUser} />}
          />

          <Route path="userprofile" element={<UserProfile />} />

          <Route
            path="*"
            element={
              <main style={{ padding: "1rem" }}>
                <p>There's nothing here!</p>
              </main>
            }
          />
        </Route>
      </Routes>

      {/* {console.log("line 194", currentRecord)}
      {console.log("line 195", currentRecord.expenses)} */}
    </div>
  );
}

// {
//   /* <div>
//         <center>
//           Current username logged in:{" "}
//           <input
//             type="text"
//             value={currentUser.displayName || ""}
//             name="username"
//             //onChange={handleChange}
//             placeholder="current username"
//           />
//           Current email logged in:
//           <input
//             type="text"
//             value={currentUser.email || ""}
//             name="email"
//             //onChange={handleChange}
//             placeholder="current username"
//           />
//         </center>
//       </div> */
// }
