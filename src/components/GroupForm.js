import React, { useState } from "react";

export default function GroupForm(props) {
  const [name, setName] = useState("");

  const handleUserInput = ({ target }) => {
    setName(target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) {
      return;
    }

    const newName = name.toLowerCase();

    if (props.nameList.includes(newName)) {
      setName("");
    } else {
      props.addName(newName);
      setName("");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter Person Name"
          maxLength={15}
          onChange={handleUserInput}
          value={name}
        />
        <input type="submit" value="ADD" />
      </form>
    </div>
  );
}
