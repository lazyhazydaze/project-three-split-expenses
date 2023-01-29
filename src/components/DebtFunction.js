export function resolveDebts(debts) {
  console.log(debts);
  // Create an empty dictionary to store the results
  let resolvedDebts = {};

  // Get the keys and values of the original dictionary
  let keys = Object.keys(debts);
  let values = Object.values(debts);

  // Create two arrays, one for users with positive debts and one for users with negative debts
  let positiveDebts = [];
  let negativeDebts = [];
  for (let i = 0; i < keys.length; i++) {
    if (values[i] > 0) {
      positiveDebts.push({
        user: keys[i],
        debt: 100 * Number(values[i]).toFixed(2),
      });
    } else {
      negativeDebts.push({
        user: keys[i],
        debt: 100 * Number(values[i]).toFixed(2),
      });
    }
  }
  console.log(JSON.stringify(positiveDebts));
  console.log(JSON.stringify(negativeDebts));

  // Sort the arrays by debt in descending and ascending order, respectively
  positiveDebts.sort((a, b) => b.debt - a.debt);
  negativeDebts.sort((a, b) => a.debt - b.debt);

  // Keep track of the current index for the positive and negative debt arrays
  let positiveIndex = 0;
  let negativeIndex = 0;

  // Loop through the positive debts
  while (positiveIndex < positiveDebts.length) {
    // Get the current user and debt
    let currentUser = positiveDebts[positiveIndex].user;
    let currentDebt = positiveDebts[positiveIndex].debt;
    console.log(currentUser);
    console.log(currentDebt);

    // Check if there are still negative debts to be paid
    if (negativeIndex < negativeDebts.length) {
      // Get the user and debt of the next negative debt
      let negativeUser = negativeDebts[negativeIndex].user;
      let negativeDebt = negativeDebts[negativeIndex].debt;

      // Calculate the amount the current user should pay
      let amountToPay = Math.min(currentDebt, Math.abs(negativeDebt));
      console.log(amountToPay);
      currentDebt -= amountToPay;
      negativeDebts[negativeIndex].debt += amountToPay;

      // Add the transaction to the resolvedDebts dictionary
      if (!(currentUser in resolvedDebts)) {
        resolvedDebts[currentUser] = {};
      }
      resolvedDebts[currentUser][negativeUser] = amountToPay / 100;

      // If the negative debt has been fully paid, move to the next one
      if (negativeDebts[negativeIndex].debt === 0) {
        negativeIndex++;
      }
    }

    // Update the current debt for the positive debt user
    positiveDebts[positiveIndex].debt = currentDebt;

    // If the positive debt has been fully paid, move to the next one
    if (currentDebt === 0) {
      positiveIndex++;
    }
  }
  console.log("end of resolved Debts");
  return resolvedDebts;
}
