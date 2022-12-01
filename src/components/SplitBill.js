import React from "react";

export default function SplitBill(props) {
  return (
    <div>
      <center>
        <button onClick={props.action}>Ready? click to split bill</button>
        <br />
        <br />
        {props.uniqueName.length > 0 && (
          <i style={{ color: "grey" }}>
            (mouse over each person for breakdown)
          </i>
        )}
      </center>
    </div>
  );
}
