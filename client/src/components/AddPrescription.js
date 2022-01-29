import React, { Component } from "react";
import {
  Button,
  Box,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from "@material-ui/core";
import AddBoxIcon from "@material-ui/icons/AddBox";
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';

import history from './../history';

const DrugTableRow = (props) => {
  const { row } = props;
  const i = row.drugKey - 1;

  return (
    <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
      <TableCell
        component="th"
        scope="row"
      >
        {row.drugKey}
      </TableCell>
      <TableCell align="left">
        <input
          style={{ width: '90%' }}
          defaultValue={row.drugName}
          name="drugName"
          onChange={(e) => props.handleChange(i,e)}
        />
      </TableCell>
      <TableCell align="left">
        <input
          style={{ width: '90%' }}
          defaultValue={row.strength}
          name="strength"
          onChange={(e) => props.handleChange(i,e)}
        />
      </TableCell>
      <TableCell align="left">
        <input
          style={{ width: '90%' }}
          defaultValue={row.dosing}
          name="dosing"
          onChange={(e) => props.handleChange(i,e)}
        />
      </TableCell>
      <TableCell align="left">
        <input
          style={{ width: '50%' }}
          defaultValue={row.duration}
          name="duration"
          onChange={(e) => props.handleChange(i,e)}
        />
        <select
          style={{
            width: '50%',
            height: 26
          }}
          name="durationFreq"
          defaultValue={row.durationFreq}
          onChange={(e) => props.handleChange(i,e)}
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
      <TableCell align="left">
        <input
          style={{ width: '90%' }}
          defaultValue={row.quantity}
          name="quantity"
          onChange={(e) => props.handleChange(i,e)}
        />
      </TableCell>
      <TableCell>
        <Button onClick={() => props.handleRemove(i)}> {/*run handleRemove*/}
          <RemoveCircleIcon/>
        </Button>
      </TableCell>
    </TableRow>
  )
}

class AddPrescription extends Component {

  state = {
    prescriptionNumber: '',
    prescriberName: '',
    prescriberAddr: '',
    patientData: {
    },
    drugs: [{
      drugKey: 1,
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
    }],
  };

  componentDidMount = async () => {
    let _patientData = await this.props.location.state.patientData;
    console.log(_patientData);
    await this.setState({ patientData: _patientData });

    let _prescriptionNumber = _patientData.details.length +1;
    await this.setState({ prescriptionNumber: _prescriptionNumber });

    let _prescriberName = await this.props.location.state.prescriberName;
    await this.setState({ prescriberName: _prescriberName });

    let _prescriberAddr = await this.props.location.state.prescriberAddr;
    await this.setState({ prescriberAddr: _prescriberAddr });

  };

  //function to handle adding of new drug row
  handleAdd = () => {
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

  //function to handle removal of drug row
  handleRemove = async (i) => {
    let drugCopy = [...this.state.drugs]; //make copy of drugs
    let index = i
    if (index > -1) {
      drugCopy.splice(index, 1);
      await this.setState({ drugs: drugCopy });
    };
    for (let i = 0; i < drugCopy.length; i++) {
      drugCopy[i].drugKey = i + 1;
    }
    await this.setState({ drugs: drugCopy });
  };

  //function to handle reset of drug rows
  handleReset = async () => {
    await this.setState({ drugs: [] });
  };

  //function to handle creating new prescription and saving the drug info on blockchain
  handleCreate = async (rows) => {
    console.log("created");
    await this.props.contract.methods.newPrescription(this.state.prescriberAddr,this.state.patientData.addr).send({ from: this.props.account });
    for (let i = 0; i < rows.length; i++) {
      let drugName = rows[i].drugName;
      let strength = rows[i].strength;
      let dosing = rows[i].dosing;
      let duration = rows[i].duration;
      let quantity = rows[i].quantity;
      console.log(rows[i].isNew);
      await this.props.contract.methods.addDrug(this.state.prescriptionNumber, drugName, strength, dosing, duration, quantity).send({ from: this.props.account }); //push new drug in new prescription to blockchain
    }
    history.push({ pathname: '/PatientList' });
    alert("New prescription created successfully");
  };

  //function to handle editing of drug row
  handleChange = async (i, event) => {
    const { name, value } = event.target;
    await this.setState(({drugs}) => ({
      drugs: [
        ...drugs.slice(0,i),
        {
          ...drugs[i],
          [name]: value,
        },
        ...drugs.slice(i+1)
      ]
    }));
    console.log(this.state.drugs[i])
  };

  render() {
    const rows = this.state.drugs;

    return (
      <form>
        <Box m={2}>
          <Grid container
            direction={"row"}
            spacing={5}
          >
            <Grid item>
              <TextField
                disabled
                id="prescriptionNumber"
                label="Prescription Number"
                value={this.state.prescriptionNumber}
              />
            </Grid>
            <Grid item>
              <TextField
                disabled
                id="prescriberName"
                label="Prescriber Name"
                value={this.state.prescriberName}
              />
            </Grid>
            <Grid item>
              <TextField
                disabled
                id="prescriberAddress"
                label="Prescriber Address"
                value={this.state.prescriberAddr}
              />
            </Grid>
          </Grid>

          <Grid container
            direction={"row"}
            spacing={5}
          >
            <Grid item>
              <TextField
                disabled
                id="patientName"
                label="Patient Name"
                value={this.state.patientData.name}
              />
            </Grid>
            <Grid item>
              <TextField
                disabled
                id="patientAddress"
                label="Patient Address"
                value={this.state.patientData.addr}
              />
            </Grid>
          </Grid>

          <br/>
          <Table
            aria-label="drug table"
          >
            <TableHead>
              <TableRow>
                <TableCell>
                  No.
                </TableCell>
                <TableCell align='left'>
                  Name
                </TableCell>
                <TableCell align='left'>
                  Strength
                </TableCell>
                <TableCell align='left'>
                  Dosing
                </TableCell>
                <TableCell align='left'>
                  Duration
                </TableCell>
                <TableCell align='left'>
                  Quantity
                </TableCell>
                <TableCell>
                  <Button onClick={() => this.handleAdd()}> {/*run handleAdd*/}
                    <AddBoxIcon/>
                  </Button>
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {rows.map((row) => (
                <DrugTableRow
                  key={row.drugKey}
                  row={row}
                  handleRemove={this.handleRemove}
                  handleChange={this.handleChange}
                />
              ))}
            </TableBody>
          </Table>
        </Box>

        <Button onClick={() => this.handleCreate(rows)}> {/*run handleCreate*/}
          Create
        </Button>
        <Button variant={"outlined"} onClick={() => this.handleReset()}>
          Reset
        </Button>
      </form>
    );
  };
};

export default AddPrescription;
