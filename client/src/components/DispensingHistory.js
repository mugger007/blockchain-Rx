import React, {
  Component,
} from "react";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
} from "@material-ui/core";

import { withStyles } from "@material-ui/core/styles";

//creating styles
const useStyles = theme => ({
  root: {
    "& > *": {
      borderBottom: "unset",
    },
  },
  table: {
    minWidth: 650,
  },
  snackbar: {
    bottom: "104px",
  },
});

function timeConverter(UNIX_timestamp){
  if (UNIX_timestamp) {
    var a = new Date(UNIX_timestamp * 1000);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
    return time;
  }
}

export const DispensingHistoryRow = (props) => {
  const { row } = props;

  return (
    <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
      <TableCell component="th" scope="row">
        {timeConverter(row.dispensedDate)}
      </TableCell>
      <TableCell align="right">{row.dispensedQuantity}</TableCell>
      <TableCell align="right">{row.dispensedDuration}</TableCell>
    </TableRow>
  );
};

class DispensingHistory extends Component {

  state = {
    prescriptionKey: '',
    drugKey: '',
    dispensedRows: [],
    isOpen: true
  };

  componentDidMount = async () => {
    console.log('Getting data from Prescription');
    let _drugKey = await this.props.drugKey; //drug key from Prescription
    console.log(_drugKey);
    await this.setState({ drugKey: _drugKey });

    let _prescriptionKey = await this.props.prescriptionKey; //prescription key from Prescription
    console.log(_prescriptionKey);
    await this.setState({ prescriptionKey: _prescriptionKey });

    let drugDetailsPart2 = await this.props.contract.methods.getPrescriptionDrugDetailsPart2(this.state.prescriptionKey, this.state.drugKey).call();
    let _dispenseCounter = drugDetailsPart2[1];

    if (_dispenseCounter > 0) {
      let _dispensedRows = [...this.state.dispensedRows]; //make shallow copy of dispensedRows
      //get details of each dispensed record
      for (let i = 1; i < (parseInt(_dispenseCounter) + 1); i++) {
        let dispensedDetails = await this.props.contract.methods.getDispensedDetails(this.state.prescriptionKey, this.state.drugKey, i).call();
        let _dispensedDate = dispensedDetails[0];
        let _dispensedQuantity = dispensedDetails[1];
        let _dispensedDuration = dispensedDetails[2];
        let _dispensed = dispensedDetails[3];
        _dispensedRows.push({
          dispensedDate: _dispensedDate,
          dispensedQuantity: _dispensedQuantity,
          dispensedDuration: _dispensedDuration,
          dispensed: _dispensed
        });
      };
      await this.setState({ dispensedRows: _dispensedRows });
    };
    console.log(this.state.dispensedRows);
  };

  //function for closing the dialog
  handleClose = (event) => {
    this.setState({ isOpen: false });
  };

  render() {
    const dispensedRows = this.state.dispensedRows;
    const isOpen = this.state.isOpen;

    return (
      <Dialog
        open={isOpen}
        onClose={() => this.handleClose()}
        aria-labelledby="dispensingHistory"
        aria-describedby="dispensingHistory"
      >
        <DialogTitle id="dispensingHistory">
          {"Dispensing History"}
        </DialogTitle>
        <DialogContent>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="DispensingTable">
              <TableHead>
                <TableRow>
                  <TableCell>Dispensed Date</TableCell>
                  <TableCell align="right">Quantity Dispensed</TableCell>
                  <TableCell align="right">Duration Dispensed</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dispensedRows.map((row) => (
                  <DispensingHistoryRow
                    key={row.dispensedDate}
                    row={row}
                  />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => this.handleClose()} autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  };
};

export default withStyles(useStyles)(DispensingHistory);
