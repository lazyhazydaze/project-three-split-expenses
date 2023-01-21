import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function GroupBalance(props) {
  let { groupId } = useParams();

  const [groupBalance, setGroupBalance] = useState("");

  // get the breakdown of each group member's net balance from backend
  // put usermodel into controller

  const getGroupBalance = async () => {
    let response = await axios.get(
      `${process.env.REACT_APP_API_SERVER}/expenses/group/${groupId}`
    );
    console.log("group balance: ", response.data);
    setGroupBalance(response.data);
  };

  useEffect(() => {
    getGroupBalance();
  }, [groupId]);

  return <div></div>;
}
