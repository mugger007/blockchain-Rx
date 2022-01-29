import React, {
  Component,
  useState,
} from "react";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  TextField,
} from "@material-ui/core";

import AddBoxIcon from "@material-ui/icons/AddBox";
import DirectionsRunIcon from '@material-ui/icons/DirectionsRun';
import DoneIcon from "@material-ui/icons/Done";
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import UpdateIcon from '@material-ui/icons/Update';
import VisibilityIcon from '@material-ui/icons/Visibility';

import DrugChanges from './DrugChanges';
import DispensingHistory from './DispensingHistory';

import { withStyles } from "@material-ui/core/styles";
import Alert from "@material-ui/lab/Alert";

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

const DrugTableRow = (props) => {
  const { row } = props;
  const i = row.drugKey - 1;
  const isValid = row.valid;
  const [edit, setEdit] = useState(false);
  const [invalid, setInvalid] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showChanges, setShowChanges] = useState(false);
  const [drugName, setDrugName] = useState(row.drugName); //set drugName from state
  const [strength, setStrength] = useState(row.strength); //set strength from state
  const [dosing, setDosing] = useState(row.dosing); //set dosing from state
  const [duration, setDuration] = useState(row.duration); //set duration from state
  const [durationFreq, setDurationFreq] = useState(''); //set durationFreq from state
  const [quantity, setQuantity] = useState(row.quantity); //set quantity from state

  return (
    <React.Fragment>
      {isValid && (
        <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
          {edit ? (
            <>
              <TableCell
                component="th"
                scope="row"
              >
                {row.drugKey}
              </TableCell>
              <TableCell
                padding="none"
                align='right'
              >
                <input
                  style={{ width: '75%' }}
                  value={drugName}
                  name="drugName"
                  onChange={(e) => setDrugName(e.target.value)}
                />
              </TableCell>
              <TableCell
                padding="none"
                align='right'
              >
                <input
                  style={{ width: '75%' }}
                  value={strength}
                  name="strength"
                  onChange={(e) => setStrength(e.target.value)}
                />
              </TableCell>
              <TableCell
                padding="none"
                align='right'
              >
                <input
                  style={{ width: '75%' }}
                  value={dosing}
                  name="dosing"
                  onChange={(e) => setDosing(e.target.value)}
                />
              </TableCell>
              <TableCell
                padding="none"
                align="right"
              >
                <input
                  style={{ width: '40%' }}
                  value={duration}
                  name="duration"
                  onChange={(e) => setDuration(e.target.value)}
                />
                <select
                  style={{
                    width: '40%',
                    height: 26
                  }}
                  name="durationFreq"
                  value={durationFreq}
                  onChange={(e) => setDurationFreq(e.target.value)}
                >
                  <option value="">
                  </option>
                  <option value="Days">
                    Day(s)
                  </option>
                  <option value="Weeks">
                    Week(s)
                  </option>
                  <option value="Months">
                    Month(s)
                  </option>
                </select>
              </TableCell>
              <TableCell
                padding="none"
                align="right"
              >
                <input
                  style={{ width: '75%' }}
                  value={quantity}
                  name="quantity"
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </TableCell>
              <TableCell>
                <Button onClick={() => { setEdit(!edit); props.handleSave(i, drugName, strength, dosing, duration, durationFreq, quantity); }}> {/*change isEdit to false and run handleSave*/}
                  Save
                </Button>
              </TableCell>
              <TableCell>
                <Button onClick={() => { setEdit(!edit); setInvalid(!invalid); setShowConfirm(!showConfirm); }}> {/*run handleConfirm and then handleInvalid*/}
                  Invalid
                </Button>
              </TableCell>
            </>
          ) : (
            <>
              <TableCell
                component="th"
                scope="row"
              >
                {row.drugKey}
              </TableCell>
              <TableCell align='right'>
                {row.drugName}
              </TableCell>
              <TableCell align='right'>
                {row.strength}
              </TableCell>
              <TableCell align='right'>
                {row.dosing}
              </TableCell>
              <TableCell align='right'>
                {row.duration} {row.durationFreq}
              </TableCell>
              <TableCell align='right'>
                {row.quantity}
              </TableCell>
              <TableCell>
                <Button onClick={() => setEdit(!edit)}> {/*change isEdit to true*/}
                  Edit
                </Button>
              </TableCell>
              <TableCell>
                <Button onClick={() => setShowInfo(!showInfo)}>
                  Info
                </Button>
                <Button onClick={() => setShowChanges(!showChanges)}>
                  Changes
                </Button>
              </TableCell>
            </>
          )}
          {showConfirm && invalid && (
            <div>
              <Dialog
                open={showConfirm}
                onClose={() => { setInvalid(!invalid); setShowConfirm(!showConfirm); }}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogTitle id="alert-dialog-title">
                  {"Confirm Invalid"}
                </DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                    Are you sure to invalidate?
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button
                    onClick={(e) => { props.handleRemoveDrug(e, i); setShowConfirm(!showConfirm); }}
                    color="primary"
                    autoFocus
                  >
                    Yes
                  </Button>
                  <Button
                    onClick={() => { setInvalid(!invalid); setShowConfirm(!showConfirm); }}
                    color="primary"
                    autoFocus
                  >
                    No
                  </Button>
                </DialogActions>
              </Dialog>
            </div>
          )}
        </TableRow>
      )}
      {/*opens dialog box showing the dispensing history of the drug*/}
      {showInfo &&
        <DispensingHistory
          prescriptionKey={props.prescriptionKey}
          drugKey={row.drugKey}
          account={props.account}
          contract={props.contract}
        />
      }
      {/*opens dialog box showing the medication history*/}
      {showChanges &&
        <DrugChanges
          patientAddr={props.patientAddr}
          prescriptionKey={props.prescriptionKey}
          currentDrug={row}
          account={props.account}
          contract={props.contract}
        />
      }
    </React.Fragment>
  );
};

const DispenseRow = (props) => {
  const { row } = props;
  const i = row.drugKey - 1;
  const isValid = row.valid;
  const dispenseCounter = row.dispenseCounter;
  const balance = row.balance; //set balance from state
  const dispensedQuantity = row.dispenseStruct[dispenseCounter].dispensedQuantity; //set dispensed quantity from state
  const dispensedDuration = row.dispenseStruct[dispenseCounter].dispensedDuration; //set dispensed quantity from state

  return (
    <React.Fragment>
      {isValid && (
        <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
          <TableCell
            component="th"
            scope="row"
          >
            {row.drugName} {row.strength} {row.dosing}
          </TableCell>
          <TableCell align='right'>
            <TextField
              disabled
              id="balance-duration"
              label="Balance Duration"
              value={`${balance} ${row.frequency}`}
            />
          </TableCell>
          <TableCell align='right'>
            <TextField
              disabled
              id="balance-quantity"
              label="Balance Quantity"
              value={balance}
            />
          </TableCell>
          <TableCell align='right'>
            <TextField
              label="Dispense Quantity"
              id="dispense-quantity"
              defaultValue={dispensedQuantity}
              variant="filled"
              onChange={(e) => { props.handleDispensedQuantityChange(i, e.target.value) }}
            />
          </TableCell>
          <TableCell>
            <TextField
              label="Dispense Duration"
              id="dispense-duration"
              defaultValue={dispensedDuration}
              variant="filled"
              onChange={(e) => { props.handleDispensedDurationChange(i, e.target.value) }}
            />
          </TableCell>
        </TableRow>
      )}
    </React.Fragment>
  );
};

class Prescription extends Component {

  state = {
    drugs: [],
    prescriptionKey: '',
    prescriberAddr: '',
    patientAddr: '',
    isOpen: false,
    isDisabled: true,
    isCheckReview: false,
    isReviewed: false,
    isCheckDispense: false,
    contract: [],
    account: []
  };

  componentDidMount = async () => {
    console.log('Getting data from PatientList');
    await this.setState({ contract: this.props.contract });
    await this.setState({ account: this.props.account });

    let _prescriptionKey = await this.props.location.state.data.prescriptionKey; //prescription key from PatientList
    console.log(_prescriptionKey);
    await this.setState({ prescriptionKey: _prescriptionKey });

    let _isReviewed = await this.props.location.state.data.reviewed; //reviewed status from PatientList
    console.log(_isReviewed);
    await this.setState({ isReviewed: _isReviewed });

    let _patientAddr = await this.props.location.state.patientData.addr;
    console.log(_patientAddr);
    await this.setState({ patientAddr: _patientAddr });

    //get prescription details
    let _drugKeys = await this.props.contract.methods.getPrescriptionDrugKeys(this.state.prescriptionKey).call();
    //if prescription contains drug keys
    console.log(_drugKeys)
    if (_drugKeys.length > 0) {
      let newDrugs = [...this.state.drugs]; //make shallow copy of drugs
      //get prescription drug details from getPrescriptionDrugDetailsPart1 and 2
      for (let i = 0; i < _drugKeys.length; i++) {
        let drugDetailsPart1 = await this.props.contract.methods.getPrescriptionDrugDetailsPart1(this.state.prescriptionKey, _drugKeys[i]).call();
        let drugDetailsPart2 = await this.props.contract.methods.getPrescriptionDrugDetailsPart2(this.state.prescriptionKey, _drugKeys[i]).call();
        let _name = drugDetailsPart1[0];
        let _strength = drugDetailsPart1[1];
        let _dosing = drugDetailsPart1[2];
        let _duration = drugDetailsPart1[3];
        let _quantity = drugDetailsPart1[4];
        let _modified = drugDetailsPart2[0];
        let _dispenseCounter = drugDetailsPart2[1];
        let _balance = drugDetailsPart2[2];
        let _valid = drugDetailsPart2[3];
        let _drugKey = _drugKeys[i];
        await newDrugs.push({
          drugKey: _drugKey,
          drugName: _name,
          strength: _strength,
          dosing: _dosing,
          duration: _duration,
          quantity: _quantity,
          modified: _modified,
          dispenseCounter: _dispenseCounter,
          balance: _balance,
          valid: _valid,
          dispenseStruct: [],
          isNew: false
        });
        let newDrugsStruct = newDrugs[i].dispenseStruct;

        if (_dispenseCounter > 0) {
          //get details of each dispensed record
          for (let j = 1; j < (parseInt(_dispenseCounter) + 1); j++) {
            let dispensedDetails = await this.props.contract.methods.getDispensedDetails(_prescriptionKey, _drugKey, j).call();
            let _dispensedDate = dispensedDetails[0];
            let _dispensedQuantity = dispensedDetails[1];
            let _dispensedDuration = dispensedDetails[2];
            let _dispensed = dispensedDetails[3];
            newDrugsStruct.push({
              dispensedDate: _dispensedDate,
              dispensedQuantity: _dispensedQuantity,
              dispensedDuration: _dispensedDuration,
              dispensed: _dispensed
            });
          };
        };
        newDrugsStruct.push({
          dispensedDate: '',
          dispensedQuantity: '',
          dispensedDuration: '',
          dispensed: false
        });
      };
      this.setState({ drugs: newDrugs }); //update drugs state
    };
    console.log(this.state);
  };

  //function for adding new drug
  handleAdd = (event) => {
    let drugCopy = [...this.state.drugs]; //make copy of drugs
    drugCopy.push({
      drugKey: this.state.drugs.length + 1,
      drugName: '',
      strength: '',
      dosing: '',
      duration: '',
      durationFreq: '',
      quantity: '',
      modified: false,
      dispenseCounter: 0,
      balance: '',
      valid: true,
      isNew: true,
      dispenseStruct: [{
        dispensedDate: '',
        dispensedQuantity: '',
        dispensedDuration: '',
        dispensed: false
      }]
    });
    this.setState({ drugs: drugCopy }); //add new line for drugs
  };

  //function to handle save
  handleSave = (i, drugName, strength, dosing, duration, durationFreq, quantity) => {
    console.log("saved: ", drugName);
    this.setState({ isDisabled: false });
    let drugCopy = [...this.state.drugs];
    drugCopy[i].drugName = drugName;
    drugCopy[i].strength = strength;
    drugCopy[i].dosing = dosing;
    drugCopy[i].duration = duration;
    drugCopy[i].durationFreq = durationFreq;
    drugCopy[i].quantity = quantity;
    this.setState({ drugs: drugCopy }); //add change to drug params
  };

  //function to handle dispense
  handleDispense = async (event) => {
    console.log(this.props.account);
    for (let i = 0; i < this.state.drugs.length; i++) {
      let valid = this.state.drugs[i].valid
      let drugKey = i+1;
      let dispenseCounter = this.state.drugs[i].dispenseCounter;
      let dispensedDuration = this.state.drugs[i].dispenseStruct[dispenseCounter].dispensedDuration;
      let dispensedQuantity = this.state.drugs[i].dispenseStruct[dispenseCounter].dispensedQuantity;
      //only push dispensing details to blockchain if drug is valid and has dispensed duration or quantity
      if (valid === true) {
        if (dispensedDuration || dispensedQuantity) {
          await this.props.contract.methods.dispenseDrug(this.state.prescriptionKey, drugKey, dispensedQuantity, dispensedDuration).send({ from: this.state.account }); //push dispensing details to blockchain
          console.log("dispensed: ", this.state.drugs[i].drugName);
        }
      }
    }
  };

  //function to handle change in dispensed quantity
  handleDispensedQuantityChange = (i, dispensedQuantity) => {
    let dispenseCounter = this.state.drugs[i].dispenseCounter;
    let drugCopy = [...this.state.drugs];
    drugCopy[i].dispenseStruct[dispenseCounter].dispensedQuantity = dispensedQuantity;
    this.setState({ drugs: drugCopy }); //add change to drug params
    console.log(this.state.drugs[i].dispenseStruct[dispenseCounter].dispensedQuantity);
  };

  //function to handle change in dispensed duration
  handleDispensedDurationChange = (i, dispensedDuration) => {
    let dispenseCounter = this.state.drugs[i].dispenseCounter;
    let drugCopy = [...this.state.drugs];
    drugCopy[i].dispenseStruct[dispenseCounter].dispensedDuration = dispensedDuration;
    this.setState({ drugs: drugCopy }); //add change to drug params
    console.log(this.state.drugs[i].dispenseStruct[dispenseCounter].dispensedDuration);
  };

  //function to handle update - updates all drugs in Rx
  handleUpdate = async (event) => {
    console.log("updated");
    for (let i = 0; i < this.state.drugs.length; i++) {
      let drugKey = i+1;
      let drugName = this.state.drugs[i].drugName;
      let strength = this.state.drugs[i].strength;
      let dosing = this.state.drugs[i].dosing;
      let duration = this.state.drugs[i].duration;
      let quantity = this.state.drugs[i].quantity;
      console.log(this.state.drugs[i].isNew);

      if (this.state.drugs[i].isNew === true) {
        await this.props.contract.methods.addDrug(this.state.prescriptionKey, drugName, strength, dosing, duration, quantity).send({ from: this.props.account }); //push new drug to blockchain
      }
      else {
        await this.props.contract.methods.updateDrug(this.state.prescriptionKey, drugKey, drugName, strength, dosing, duration, quantity).send({ from: this.props.account }); //push updates on existing drug to blockchain
      }
    }
    this.setState({ isDisabled: true, isOpen: true });
  };

  //function to handle when user clicks yes invalid a specific row of id:i
  handleRemoveDrug = async (event, i) => {
    let drugKey = i+1;
    await this.props.contract.methods.removeDrug(this.state.prescriptionKey, drugKey).send({ from: this.props.account });

    const drugCopy = [...this.state.drugs];
    console.log("deleted row: ", i);
    drugCopy.splice(i, 1);
    this.setState({ drugs: drugCopy });
  };

  //function for closing the alert snackbar
  handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    this.setState({ isOpen: false });
  };

  render() {
    const rows = this.state.drugs;
    const disable = this.state.isDisabled;
    const open = this.state.isOpen;
    const checkReview = this.state.isCheckReview;
    const checkDispense = this.state.isCheckDispense;
    const review = this.state.isReviewed;
    const { classes } = this.props;

    return (
      <TableContainer component={Paper}>
        <Snackbar
          open={open}
          autoHideDuration={2000}
          onClose={this.handleClose}
          className={classes.snackbar}
        >
          <Alert
            onClose={this.handleClose}
            severity="success"
          >
           Successful
          </Alert>
        </Snackbar>

        <div style={{
          display: "flex",
          justifyContent: "space-left"
        }}>
            <Button onClick={this.handleAdd}>
              <AddBoxIcon />
              ADD
            </Button>
            {rows.length !== 0 && (
              <div>
                {disable ? (
                  <Button
                    disabled
                    onClick={this.handleUpdate}
                  >
                    <DoneIcon />
                    UPDATED
                  </Button>
                ) : (
                  <Button onClick={this.handleUpdate}>
                    <UpdateIcon />
                    UPDATE
                  </Button>
                )}
                {review ? (
                  <Button
                    disabled
                    onClick={() => { this.setState({ isCheckReview: true }) }}
                  >
                    <DoneIcon />
                    REVIEWED
                  </Button>
                ) : (
                  <Button onClick={() => { this.setState({ isCheckReview: true }) }}>
                    <VisibilityIcon />
                    REVIEW
                  </Button>
                )}
                <Button onClick={() => { this.setState({ isCheckDispense: true }) }}>
                  <DirectionsRunIcon />
                  DISPENSE
                </Button>
              </div>
            )}
        </div>

        {checkReview && (
          <div>
            <Dialog
              open={checkReview}
              onClose={() => { this.setState({ isCheckReview: false }) }}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">
                {"Confirm Review"}
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  Are you sure to review?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={() => {
                    this.props.contract.methods.reviewPrescription(this.state.prescriptionKey).send({ from: this.props.account });
                    this.setState({ isCheckReview: false });
                    this.setState({ isReviewed: true });
                  }}
                  color="primary"
                  autoFocus
                > {/*push reviewed status to blockchain*/}
                  Yes
                </Button>
                <Button
                  onClick={() => { this.setState({ isCheckReview: false }) }}
                  color="primary"
                  autoFocus
                >
                  No
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        )}

        {checkDispense && (
          <div>
            <Dialog
              fullScreen
              open={checkDispense}
              onClose={() => {this.setState({ isCheckDispense: false }) }}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <div style={{
                display: "flex",
                justifyContent: "space-between"
              }}>
                <DialogTitle id="alert-dialog-title">
                  {"Dispense Medications"}
                </DialogTitle>
                <Button onClick={() => {this.setState({ isCheckDispense: false }) }}>
                  <HighlightOffIcon />
                </Button>
              </div>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  Input the quantity OR duration to dispense (DO NOT INPUT BOTH)
                </DialogContentText>
                <TableContainer component={Paper}>
                  <Table
                    className={classes.table}
                    aria-label="dispense table"
                  >
                    <TableBody>
                      {rows.map((row) => (
                        <DispenseRow
                          key={row.drugKey}
                          row={row}
                          handleDispensedQuantityChange={this.handleDispensedQuantityChange}
                          handleDispensedDurationChange={this.handleDispensedDurationChange}
                        />
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </DialogContent>
              <DialogActions>
                {/*push dispensed info to blockchain*/}
                <Button
                  onClick={(e) => { this.setState({ isCheckDispense: false }); this.handleDispense(e); }}
                  color="primary"
                  autoFocus
                >
                  Dispense
                </Button>
                <Button
                  onClick={() => {this.setState({ isCheckDispense: false })}}
                  color="primary"
                  autoFocus
                >
                  Cancel
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        )}

        <Table
          className={classes.table}
          aria-label="drug table"
        >
          <TableHead>
            <TableRow>
              <TableCell>
                No.
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
                Duration
              </TableCell>
              <TableCell align='right'>
                Quantity
              </TableCell>
              <TableCell align='right'>
              </TableCell>
              <TableCell align='right'>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {rows.map((row) => (
              <DrugTableRow
                key={row.drugKey}
                row={row}
                handleSave={this.handleSave}
                handleRemoveDrug={this.handleRemoveDrug}
                patientAddr={this.state.patientAddr}
                prescriptionKey={this.state.prescriptionKey}
                contract={this.state.contract}
                account={this.state.account}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };
};

export default withStyles(useStyles)(Prescription);
