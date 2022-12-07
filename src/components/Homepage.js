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
          <Link to="/friendpage">
            <button>Add/View Friends</button>
          </Link>
          <br />
          <Link to="/invoices">
            <button>View Invoices</button>
          </Link>
          <Link to="/userprofile">
            <button>Edit Profile</button>
          </Link>
          <br />
          <Link to="/">Return back to Homepage</Link>
        </nav>
      </center>
      <hr />
      <Outlet />
    </div>
  );
}
