import React from "react";
import "./DisplayExpense.css";

const getFormattedPrice = (price) => {
  const priceTwoDecimal = Number(price).toFixed(2);
  return priceTwoDecimal;
};

const getRandomColor = () => {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

export default function DisplayExpense(props) {
  const pricePerPax = () => {
    let output = (props.amount / props.spenders.length).toFixed(2);
    return output;
  };

  return (
    <div className="column">
      <div className="card">
        <h3 className="bangers" style={{ color: getRandomColor() }}>
          {props.item.toUpperCase()}
        </h3>
        <p>
          <b>${getFormattedPrice(props.amount)}</b> (${pricePerPax()}/px)
        </p>
        <p>
          <p>
            <i>{props.spenders.join(" ")}</i>{" "}
          </p>
        </p>
        <button value={props.id} onClick={props.deleteRecord}>
          ✖
        </button>
      </div>
    </div>
  );
}
