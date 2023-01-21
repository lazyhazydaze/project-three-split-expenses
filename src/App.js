import { Routes, Route } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import "./App.css";

import Header from "./components/Header";
import InvoiceForm from "./components/InvoiceForm";
import InvoiceRetrieve from "./components/InvoiceRetrieve";
import DetailedInvoiceDisplay from "./components/DetailedInvoiceDisplay";
import { Friendpage } from "./components/Friendpage";
import { UserProfile } from "./components/UserProfile";
import Dashboard from "./components/Dashboard";
import GroupForm from "./components/GroupForm";

export default function App() {
  const [currentUser, setCurrentUser] = useState({});
  const { isLoading, user, isAuthenticated, loginWithRedirect } = useAuth0();

  const createOrGetUser = async (name, email) => {
    let newUser = {
      name: name,
      email: email,
    };
    let response = await axios.post(
      `${process.env.REACT_APP_API_SERVER}/users`,
      newUser
    );
    console.log("setCurrentUser here: ", response.data);
    setCurrentUser(response.data);
  };

  // On register/login on AuthO, retrieve all the users from the database
  useEffect(() => {
    console.log(user);
    console.log(isAuthenticated);
    if (!isLoading) {
      if (isAuthenticated) {
        createOrGetUser(user.nickname, user.email);
      } else {
        loginWithRedirect();
      }
    }
  }, [isLoading]);

  return (
    <div>
      <Routes>
        <Route path="/" element={<Header currentUser={currentUser} />}>
          <Route path="/" element={<Dashboard currentUser={currentUser} />} />
          <Route
            path="dashboard"
            element={<Dashboard currentUser={currentUser} />}
          />
          <Route
            path="creategroup"
            element={<GroupForm currentUser={currentUser} />}
          />
          <Route
            path="contacts"
            element={<Friendpage currentUser={currentUser} />}
          />
          <Route
            path="group/:groupId/invoice/:invoiceId"
            element={<DetailedInvoiceDisplay />}
          />
          <Route
            path="group/:groupId/createinvoice"
            element={<InvoiceForm currentUser={currentUser} />}
          />
          <Route path="userprofile" element={<UserProfile />} />
          <Route
            path="group/:groupId/invoices"
            element={<InvoiceRetrieve currentUser={currentUser} />}
          />

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
    </div>
  );
}
