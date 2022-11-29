import React from "react";

export default function SplitBill(props) {
  return (
    <div>
      <center>
        <button className="split_btn" onClick={props.action}>
          SPLIT THE BILL
        </button>
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
