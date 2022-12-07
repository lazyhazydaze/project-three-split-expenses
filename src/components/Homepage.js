import React from "react";
import { Outlet, Link } from "react-router-dom";

export default function Homepage(props) {
  return (
    <div>
      <center>
        <u>
          <h1>HOMEPAGE.</h1>
        </u>
        <nav>
          <Link to="/splitabill">
            <button>Split-A-Bill</button>
          </Link>
          <button>Add-A-Friend</button>
          <br />
          <Link to="/invoices">
            <button>View Invoices</button>
          </Link>
          <button>View Contact List</button>
          <br />
          <Link to="/">Return back to Homepage</Link>
        </nav>
      </center>
      <hr />
      <Outlet />
    </div>
  );
}
