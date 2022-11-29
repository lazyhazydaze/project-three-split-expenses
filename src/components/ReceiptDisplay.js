import React from "react";

export default function ReceiptDisplay(props) {
  return (
    <div className="tooltip">
      <div className="flex-arrow">
        <div>{props.name}</div>
        <div>${props.receipt.total.toFixed(2)}</div>
      </div>
      <span className="tooltiptext">
        <table>
          <tr>
            <th>Purchase</th>
            <th>Cost</th>
          </tr>
          {props.receipt.purchases.map((purchase, i) => (
            <tr>
              <td>{purchase}</td>
              <td>${props.receipt.costprice[i].toFixed(2)}</td>
            </tr>
          ))}
        </table>
      </span>
    </div>
  );
}