import React, { useState } from "react";
import {
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Typography,
  ListItemButton,
} from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

export default function ReceiptDisplay(props) {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      {props.receipt.purchases.length > 0 && (
        <div>
          <ListItem onClick={handleClickOpen}>
            <ListItemButton>
              <ListItemText
                primary={props.name.label}
                secondary={props.name.value}
              />
              <ListItemSecondaryAction>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  component="span"
                >
                  ${props.receipt.total.toFixed(2)}
                </Typography>
              </ListItemSecondaryAction>
            </ListItemButton>
          </ListItem>
          <Dialog open={open} onClose={handleClose}>
            <center>
              <DialogTitle>Expenses for {props.name.label}</DialogTitle>
            </center>
            <DialogContent>
              <DialogContentText>
                <AcccessibleTable receipt={props.receipt} />
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Close</Button>
            </DialogActions>
          </Dialog>
        </div>
      )}
    </div>
  );
}

function createData(item, cost) {
  return { item, cost };
}

function AcccessibleTable(props) {
  const rows = props.receipt.purchases.map((item, i) =>
    createData(item, props.receipt.costprice[i])
  );

  console.log("rows", rows);

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 300 }} aria-label="caption table">
        <TableHead>
          <TableRow>
            <TableCell>Purchase</TableCell>
            <TableCell align="right">Cost&nbsp;($)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.item}>
              <TableCell component="th" scope="row">
                {row.item}
              </TableCell>
              <TableCell align="right">{row.cost}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

// receipt props is an object:
//{username: 'Bella Tan', purchases: ['AAA','BBB'], costprice: [10,20], total: 4.5}

// <div>
//   {props.receipt.purchases.length > 0 && (
//     <div className="tooltip">
//       <div className="flex-arrow">
//         <div>
//           {props.name.label}({props.name.value})
//         </div>
//         <div>${props.receipt.total.toFixed(2)}</div>
//       </div>

//       <span className="tooltiptext">
//         <table>
//           <tr>
//             <th>Purchase</th>
//             <th>Cost</th>
//           </tr>
// {props.receipt.purchases.map((purchase, i) => (
//   <tr>
//     <td>{purchase}</td>
//     <td>${props.receipt.costprice[i].toFixed(2)}</td>
//   </tr>
// ))}
//         </table>
//       </span>
//     </div>
//   )}
// </div>
