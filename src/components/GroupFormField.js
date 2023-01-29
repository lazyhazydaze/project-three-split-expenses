import * as React from "react";
import { useAutocomplete } from "@mui/base/AutocompleteUnstyled";
import { styled } from "@mui/system";

const Input = styled("input")(() => ({
  width: 200,
  backgroundColor: "#fff",
  color: "#000",
}));

const Listbox = styled("ul")(() => ({
  width: 200,
  margin: 0,
  padding: 0,
  zIndex: 1,
  position: "absolute",
  listStyle: "none",
  backgroundColor: "#CBC3E3",
  overflow: "auto",
  maxHeight: 200,
  border: "1px solid rgba(0,0,0,.25)",
  "& li.Mui-focused": {
    backgroundColor: "#4a8df6",
    color: "white",
    cursor: "pointer",
  },
  "& li:active": {
    backgroundColor: "#2977f5",
    color: "white",
  },
}));

export default function UseAutocomplete(props) {
  const [inputValue, setInputValue] = React.useState("");

  const {
    getRootProps,
    getInputProps,
    getListboxProps,
    getOptionProps,
    groupedOptions,
  } = useAutocomplete({
    options: props.optionlist,
    getOptionLabel: (option) => option.email,
    isOptionEqualToValue: (option, value) => option.email === value.email,
    onInputChange: (event, newInputValue) => setInputValue(newInputValue),
    inputValue: inputValue,
    onChange: (event, newValue) => props.onChange(newValue, props.index),
    value: props.value,
  });

  return (
    <div>
      <div {...getRootProps()}>
        <Input {...getInputProps()} placeholder="Email" />
      </div>
      {groupedOptions.length > 0 ? (
        <Listbox {...getListboxProps()}>
          {groupedOptions.map((option, index) => (
            <li {...getOptionProps({ option, index })}>{option.email}</li>
          ))}
        </Listbox>
      ) : null}
    </div>
  );
}
