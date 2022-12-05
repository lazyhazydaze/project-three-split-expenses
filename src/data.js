export const contactList = [
  { value: "abigail@gmail.com", label: "Abigail K" },
  { value: "bella@gmail.com", label: "Bella Tan" },
  { value: "cassan@gmail.com", label: "Cassan Lee" },
  { value: "darren@gmail.com", label: "Darren Kim" },
  { value: "red@gmail.com", label: "Red" },
  { value: "green@gmail.com", label: "Green" },
  { value: "yellow@gmail.com", label: "Yellow" },
  { value: "blue@gmail.com", label: "Blue" },
  { value: "white@gmail.com", label: "White" },
];

contactList.sort(function (a, b) {
  const nameA = a.value.toUpperCase(); // ignore upper and lowercase
  const nameB = b.value.toUpperCase(); // ignore upper and lowercase

  // sort in an ascending order
  if (nameA < nameB) {
    return -1;
  }
  if (nameA > nameB) {
    return 1;
  }

  // names must be equal
  return 0;
});

// value: email address (unique)
// label: name (non-unique)
