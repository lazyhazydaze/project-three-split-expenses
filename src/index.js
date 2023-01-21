import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";

import { Auth0Provider } from "@auth0/auth0-react";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Auth0Provider
    // domain={process.env.REACT_APP_DOMAIN}
    // clientId={process.env.REACT_APP_CLIENT_ID}
    // redirectUri={window.location.origin}
    // audience={process.env.REACT_APP_AUDIENCE}
    domain="dev-zokyflfwilpaj8at.us.auth0.com"
    clientId="y67qcyHxyYVv1atFCxLpM5aq0SuxW021"
    redirectUri="http://localhost:3000"
    audience="https://project3/api"
    scope="read:current_user update:current_user_metadata"
  >
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  </Auth0Provider>
);
