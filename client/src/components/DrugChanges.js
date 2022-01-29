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

export const dosingDict = {
  "OD": 1,
  "BD": 2,
  'TDS': 3,
  "QDS": 4
};

export const DrugHistoryRow = (props) => {
  const { row } = props;

  return (
    <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
      <TableCell component="th" scope="row">
        {timeConverter(row.date)}
      </TableCell>
      <TableCell align="right">
        {row.drugName}
      </TableCell>
      <TableCell align="right">
        {row.strength}
      </TableCell>
      <TableCell align="right">
        {row.dosing}
      </TableCell>
      <TableCell align="left">
        {row.changes.map(s =>
          <React.Fragment>
            {s}
            <br/>
          </React.Fragment>
        )}
      </TableCell>
    </TableRow>
  );
};

class DrugChanges extends Component {

  state = {
    currentDrug: [],
    previousDrugs: [],
    prescriptionKey: '',
    patientAddr: '',
    tempPreviousDrug: [],
    isOpen: true,
  };

  componentDidMount = async () => {
    console.log('Getting data from Prescription');
    let _patientAddr = await this.props.patientAddr; //patient addr from Prescription
    console.log(_patientAddr);
    await this.setState({ patientAddr: _patientAddr });

    let _prescriptionKey = await this.props.prescriptionKey; //prescription key from Prescription
    console.log(_prescriptionKey);
    await this.setState({ prescriptionKey: _prescriptionKey });

    let _currentDrug = await this.props.currentDrug; //prescription key from Prescription
    await this.setState({ currentDrug: {
      drugName: _currentDrug.drugName,
      strength: _currentDrug.strength,
      dosing: _currentDrug.dosing,
    } });
    console.log(this.state.currentDrug, this.state.currentDrug.drugName);

    //get patient prescription list from patientStructs
    let _patientPrescriptionList = await this.props.contract.methods.getPatientPrescrptionList(this.state.patientAddr).call();
    console.log(_patientPrescriptionList);
    //get index of current prescription key in patient's prescription list
    let _index = _patientPrescriptionList.indexOf(_prescriptionKey);
    console.log(_index);
    //get details of prescriptions that came before existing prescription
    if (_index > 0) {
      for (let i = 0; i < _index+1; i++) {
        //get drug details from the other prescription
        let _sameDrugDetails = await this.props.contract.methods.checkChanges(_patientPrescriptionList[i], this.state.currentDrug.drugName).call();
        console.log(_sameDrugDetails);
        //if same drug is present in the other prescription
        if (_sameDrugDetails) {
          let _name = _sameDrugDetails[1];
          let _strength = _sameDrugDetails[2];
          let _dosing = _sameDrugDetails[3];
          //get date of the other prescription
          let _patientPrescriptionOverview = await this.props.contract.methods.getPatientPrescrptionOverview(_patientPrescriptionList[i]).call();
          let _date = _patientPrescriptionOverview[0];

          let _changes = [];
          //if tempPreviousDrug is not then compare with whats in tempPreviousDrug and then replace what was in tempPreviousDrug
          if (Object.keys(this.state.tempPreviousDrug).length !== 0) {
            console.log('comparing')
            //compare dosing and strength with the other prescription
            if (parseInt(_strength) !== parseInt(this.state.tempPreviousDrug.strength)) {
              if (parseInt(this.state.tempPreviousDrug.strength) < parseInt(_strength)) {
                _changes.push('Dose increased from ' + this.state.tempPreviousDrug.strength + ' to ' + _strength);
              } else {
                _changes.push('Dose decreased from ' + this.state.tempPreviousDrug.strength + ' to ' + _strength);
              };
            };
            if (_dosing !== this.state.tempPreviousDrug.dosing) {
              if (dosingDict[this.state.tempPreviousDrug.dosing] < dosingDict[_dosing]) {
                _changes.push('Dosing frequency increased from ' + this.state.tempPreviousDrug.dosing + ' to ' + _dosing);
              } else {
                _changes.push('Dosing frequency reduced from ' + this.state.tempPreviousDrug.dosing + ' to ' + _dosing);
              };
            };
          };

          //update tempPreviousDrug
          await this.setState({ tempPreviousDrug: {
            date: _date,
            drugName: _name,
            strength: _strength,
            dosing: _dosing,
          } });
          //update previousDrugs
          let previousDrugs = [...this.state.previousDrugs]; //make shallow copy of drugs
          await previousDrugs.push({
            date: _date,
            drugName: this.state.tempPreviousDrug.drugName,
            strength: this.state.tempPreviousDrug.strength,
            dosing: this.state.tempPreviousDrug.dosing,
            changes: _changes,
          });
          this.setState({ previousDrugs: previousDrugs }); //update drugs state
        } else {
          console.log('No similar drug found');
        };
      };
    } else {
      console.log('No earlier prescriptions');
    };
    console.log(this.state.previousDrugs);
  };

  //function for closing the dialog
  handleClose = (event) => {
    this.setState({ isOpen: false });
  };

  render() {
    const rows = this.state.previousDrugs;
    const isOpen = this.state.isOpen;

    return (
      <Dialog
        open={isOpen}
        onClose={() => this.handleClose()}
        aria-labelledby="drugChanges"
        aria-describedby="drugChanges"
      >
        <DialogTitle id="drugChanges">
          {"Medication History"}
        </DialogTitle>
        <DialogContent>
          <TableContainer component={Paper}>
            <Table
              aria-label="drugChanges"
            >
              <TableHead>
                <TableRow>
                  <TableCell>
                    Date of Prescription
                  </TableCell>
                  <TableCell align='right'>
                    Name
                  </TableCell>
                  <TableCell align='right'>
                    Strength
                  </TableCell>
                  <TableCell align='right'>
                    Dosing
                  </TableCell>
                  <TableCell align='right'>
                    Change(s) from Previous Prescription
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <DrugHistoryRow
                    key={row.prescriptionKey}
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

export default withStyles(useStyles)(DrugChanges);
