import React, {
  Component,
} from "react";

import {
  Box,
  Button,
  Checkbox,
  Grid,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  TextField,
} from "@material-ui/core";

import AddBoxIcon from "@material-ui/icons/AddBox";
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';

import history from './../history';

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

const PrescriberTableRow = (props) => {
  const { row } = props;
  const isItemSelected = props.isSelected(row.addr);
  const edit = props.isEdit;

  return (
    <React.Fragment>
      {edit && isItemSelected ? (
        <TableRow
          hover
          tabIndex={-1}
          key={row.addr}
          sx={{ '& > *': { borderBottom: 'unset' } }}
        >
          <TableCell padding="checkbox">
          </TableCell>
          <TableCell
            component="th"
            scope="row"
            align='right'
          >
            <input
              style={{ width: '75%' }}
              value={row.name}
              name="name"
              onChange={(e) => props.handleEdit(e,row)}
            />
          </TableCell>
          <TableCell
            padding="none"
            align='right'
          >
            <input
              style={{ width: '75%' }}
              value={row.mcr}
              name="mcr"
              onChange={(e) => props.handleEdit(e,row)}
            />
          </TableCell>
          <TableCell
            padding="none"
            align='right'
          >
            <input
              style={{ width: '75%' }}
              value={row.clinicName}
              name="clinicName"
              onChange={(e) => props.handleEdit(e,row)}
            />
          </TableCell>
          <TableCell
            padding="none"
            align="right"
          >
            <input
              style={{ width: '75%' }}
              value={row.clinicAddress}
              name="clinicAddress"
              onChange={(e) => props.handleEdit(e,row)}
            />
          </TableCell>
          <TableCell
            padding="none"
            align="right"
          >
            <input
              style={{ width: '75%' }}
              value={row.addr}
              name="addr"
              onChange={(e) => props.handleEdit(e,row)}
            />
          </TableCell>
        </TableRow>
      ) : (
        <TableRow
          hover
          onClick={(event) => props.handleClick(event,row.addr)}
          role="checkbox"
          aria-checked={isItemSelected}
          tabIndex={-1}
          key={row.addr}
          selected={isItemSelected}
          sx={{ '& > *': { borderBottom: 'unset' } }}
        >
          <TableCell padding="checkbox">
            <Checkbox
              color="primary"
              checked={isItemSelected}
            />
          </TableCell>
          <TableCell
            component="th"
            scope="row"
            align='right'
          >
            {row.name}
          </TableCell>
          <TableCell align='right'>
            {row.mcr}
          </TableCell>
          <TableCell align='right'>
            {row.clinicName}
          </TableCell>
          <TableCell align='right'>
            {row.clinicAddress}
          </TableCell>
          <TableCell align='right'>
            {row.addr}
          </TableCell>
        </TableRow>
      )}
    </React.Fragment>
  )
}

const PatientTableRow = (props) => {
  const { row } = props;
  const isItemSelected = props.isSelected(row.addr);
  const edit = props.isEdit;

  return (
    <React.Fragment>
      {edit && isItemSelected ? (
        <TableRow
          hover
          tabIndex={-1}
          key={row.addr}
          sx={{ '& > *': { borderBottom: 'unset' } }}
        >
          <TableCell padding="checkbox">
          </TableCell>
          <TableCell
            component="th"
            scope="row"
            align='right'
          >
            <input
              style={{ width: '75%' }}
              value={row.name}
              name="name"
              onChange={(e) => props.handleEdit(e,row)}
            />
          </TableCell>
          <TableCell
            padding="none"
            align='right'
          >
            <input
              style={{ width: '75%' }}
              value={row.ic}
              name="ic"
              onChange={(e) => props.handleEdit(e,row)}
            />
          </TableCell>
          <TableCell
            padding="none"
            align='right'
          >
            <input
              style={{ width: '75%' }}
              value={row.birthDate}
              name="birthDate"
              onChange={(e) => props.handleEdit(e,row)}
            />
          </TableCell>
          <TableCell
            padding="none"
            align="right"
          >
            <input
              style={{ width: '75%' }}
              value={row.homeAddress}
              name="homeAddress"
              onChange={(e) => props.handleEdit(e,row)}
            />
          </TableCell>
          <TableCell
            padding="none"
            align="right"
          >
            <input
              style={{ width: '75%' }}
              value={row.addr}
              name="addr"
              onChange={(e) => props.handleEdit(e,row)}
            />
          </TableCell>
        </TableRow>
      ) : (
        <TableRow
          hover
          onClick={(event) => props.handleClick(event,row.addr)}
          role="checkbox"
          aria-checked={isItemSelected}
          tabIndex={-1}
          key={row.addr}
          selected={isItemSelected}
          sx={{ '& > *': { borderBottom: 'unset' } }}
        >
          <TableCell padding="checkbox">
            <Checkbox
              color="primary"
              checked={isItemSelected}
            />
          </TableCell>
          <TableCell
            component="th"
            scope="row"
            align='right'
          >
            {row.name}
          </TableCell>
          <TableCell align='right'>
            {row.ic}
          </TableCell>
          <TableCell align='right'>
            {row.birthDate}
          </TableCell>
          <TableCell align='right'>
            {row.homeAddress}
          </TableCell>
          <TableCell align='right'>
            {row.addr}
          </TableCell>
        </TableRow>
      )}
    </React.Fragment>
  )
}

const PharmacistTableRow = (props) => {
  const { row } = props;
  const isItemSelected = props.isSelected(row.addr);
  const edit = props.isEdit;

  return (
    <React.Fragment>
      {edit && isItemSelected ? (
        <TableRow
          hover
          tabIndex={-1}
          key={row.addr}
          sx={{ '& > *': { borderBottom: 'unset' } }}
        >
          <TableCell padding="checkbox">
          </TableCell>
          <TableCell
            component="th"
            scope="row"
            align='right'
          >
            <input
              style={{ width: '75%' }}
              value={row.name}
              name="name"
              onChange={(e) => props.handleEdit(e,row)}
            />
          </TableCell>
          <TableCell
            padding="none"
            align='right'
          >
            <input
              style={{ width: '75%' }}
              value={row.prn}
              name="prn"
              onChange={(e) => props.handleEdit(e,row)}
            />
          </TableCell>
          <TableCell
            padding="none"
            align='right'
          >
            <input
              style={{ width: '75%' }}
              value={row.clinicName}
              name="clinicName"
              onChange={(e) => props.handleEdit(e,row)}
            />
          </TableCell>
          <TableCell
            padding="none"
            align="right"
          >
            <input
              style={{ width: '75%' }}
              value={row.clinicAddress}
              name="clinicAddress"
              onChange={(e) => props.handleEdit(e,row)}
            />
          </TableCell>
          <TableCell
            padding="none"
            align="right"
          >
            <input
              style={{ width: '75%' }}
              value={row.addr}
              name="addr"
              onChange={(e) => props.handleEdit(e,row)}
            />
          </TableCell>
        </TableRow>
      ) : (
        <TableRow
          hover
          onClick={(event) => props.handleClick(event,row.addr)}
          role="checkbox"
          aria-checked={isItemSelected}
          tabIndex={-1}
          key={row.addr}
          selected={isItemSelected}
          sx={{ '& > *': { borderBottom: 'unset' } }}
        >
          <TableCell padding="checkbox">
            <Checkbox
              color="primary"
              checked={isItemSelected}
            />
          </TableCell>
          <TableCell
            component="th"
            scope="row"
            align='right'
          >
            {row.name}
          </TableCell>
          <TableCell align='right'>
            {row.prn}
          </TableCell>
          <TableCell align='right'>
            {row.clinicName}
          </TableCell>
          <TableCell align='right'>
            {row.clinicAddress}
          </TableCell>
          <TableCell align='right'>
            {row.addr}
          </TableCell>
        </TableRow>
      )}
    </React.Fragment>
  )
}

const options = [
  {
    value: 'patients',
    label: 'Patients',
  },
  {
    value: 'prescribers',
    label: 'Prescribers',
  },
  {
    value: 'pharmacists',
    label: 'Pharmacists',
  },
];

class Admin extends Component {

  state = {
    patients: [],
    prescribers: [],
    pharmacists: [],
    view: 'patients',
    selected: [],
    isEdit: false,
  };

  componentDidMount = async () => {
    console.log('Getting data');
    //get list of patient addr
    let _patientList = await this.props.contract.methods.getPatientList().call();
    console.log(_patientList)
    //get list of prescriber addr
    let _prescriberList = await this.props.contract.methods.getPrescriberList().call();
    console.log(_prescriberList)
    //get list of pharmacist addr
    let _pharmacistList = await this.props.contract.methods.getPharmacistList().call();
    console.log(_pharmacistList)

    if (_patientList.length > 0) {
      //get patient details from patientStructs
      for (let i = 0; i < _patientList.length; i++) {
        let _patient = await this.props.contract.methods.patientStructs(_patientList[i]).call();
        let _name = _patient.name;
        let _ic = _patient.ic;
        let _birthDate = _patient.birthDate;
        let _homeAddress = _patient.homeAddress;
        let _addr = _patient.addr;
        let _valid = _patient.valid;
        var newPatients = [...this.state.patients]; //make shallow copy of patients
        if (_valid) {
          newPatients.push({
            name: _name,
            ic: _ic,
            birthDate: _birthDate,
            homeAddress: _homeAddress,
            addr: _addr,
            valid: _valid,
          }); //push new entry into patients' copy
        };
        this.setState({ patients: newPatients }); //update state
      };
    };

    if (_prescriberList.length > 0) {
      //get prescriber details from prescriberStructs
      for (let i = 0; i < _prescriberList.length; i++) {
        let _prescriber = await this.props.contract.methods.prescriberStructs(_prescriberList[i]).call();
        let _name = _prescriber.name;
        let _mcr = _prescriber.mcr;
        let _clinicName = _prescriber.clinicName;
        let _clinicAddress = _prescriber.clinicAddress;
        let _addr = _prescriber.addr;
        let _valid = _prescriber.valid;
        var newPrescribers = [...this.state.prescribers]; //make shallow copy of prescribers
        if (_valid) {
          newPrescribers.push({
            name: _name,
            mcr: _mcr,
            clinicName: _clinicName,
            clinicAddress: _clinicAddress,
            addr: _addr,
            valid: _valid,
          }); //push new entry into prescribers' copy
        };
        this.setState({ prescribers: newPrescribers }); //update state
      };
    };

    if (_pharmacistList.length > 0) {
      //get pharmacist details from pharmacistStructs
      for (let i = 0; i < _pharmacistList.length; i++) {
        let _pharmacist = await this.props.contract.methods.pharmacistStructs(_pharmacistList[i]).call();
        let _name = _pharmacist.name;
        let _prn = _pharmacist.prn;
        let _clinicName = _pharmacist.clinicName;
        let _clinicAddress = _pharmacist.clinicAddress;
        let _addr = _pharmacist.addr;
        let _valid = _pharmacist.valid;
        var newPharmacists = [...this.state.pharmacists]; //make shallow copy of prescribers
        if (_valid) {
          newPharmacists.push({
            name: _name,
            prn: _prn,
            clinicName: _clinicName,
            clinicAddress: _clinicAddress,
            addr: _addr,
            valid: _valid,
          }); //push new entry into pharmacists' copy
        };
        this.setState({ pharmacists: newPharmacists }); //update state
      };
    };
    console.log(this.state);
  };

  //function to handle change in selected view
  handleChange = (event) => {
    console.log(event.target.value);
    this.setState({ view: event.target.value });
  };

  //check if row.addr is selected
  isSelected = (_addr) => this.state.selected.indexOf(_addr) !== -1;

  //function to handle clicking on a row/checkbox
  handleClick = async (event, _addr) => {
    let selected = this.state.selected;
    let selectedIndex = selected.indexOf(_addr);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, _addr);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    };
    await this.setState({ selected: newSelected });
    console.log(this.state.selected);
  };

  //function to handle editing of drug row
  handleEdit = async (event, row) => {
    const { name, value } = event.target;
    if (this.state.view === 'prescribers') {
      let i = this.state.prescribers.findIndex(x => x.addr === row.addr);
      await this.setState(({prescribers}) => ({
        prescribers: [
          ...prescribers.slice(0,i),
          {
            ...prescribers[i],
            [name]: value,
          },
          ...prescribers.slice(i+1)
        ]
      }));
    };
    if (this.state.view === 'patients') {
      let i = this.state.patients.findIndex(x => x.addr === row.addr);
      await this.setState(({patients}) => ({
        patients: [
          ...patients.slice(0,i),
          {
            ...patients[i],
            [name]: value,
          },
          ...patients.slice(i+1)
        ]
      }));
    };
    if (this.state.view === 'pharmacists') {
      let i = this.state.pharmacists.findIndex(x => x.addr === row.addr);
      await this.setState(({pharmacists}) => ({
        pharmacists: [
          ...pharmacists.slice(0,i),
          {
            ...pharmacists[i],
            [name]: value,
          },
          ...pharmacists.slice(i+1)
        ]
      }));
    };
  };

  //function to handle save
  handleSave = async (event) => {
    let selected = this.state.selected;
    if (this.state.view === 'patients') {
      for (let i = 0; i < selected.length; i++) {
        let _index = this.state.patients.findIndex(x => x.addr === selected[i]);
        await this.props.contract.methods.updatePatient(this.state.patients[_index].name, this.state.patients[_index].ic, this.state.patients[_index].birthDate, this.state.patients[_index].homeAddress, this.state.patients[_index].addr).send({ from: this.props.account })
      };
    };
    if (this.state.view === 'prescribers') {
      for (let i = 0; i < selected.length; i++) {
        let _index = this.state.prescribers.findIndex(x => x.addr === selected[i]);
        await this.props.contract.methods.updatePrescriber(this.state.prescribers[_index].name, this.state.prescribers[_index].mcr, this.state.prescribers[_index].clinicName, this.state.prescribers[_index].clinicAddress, this.state.prescribers[_index].addr).send({ from: this.props.account })
      };
    };
    if (this.state.view === 'pharmacists') {
      for (let i = 0; i < selected.length; i++) {
        let _index = this.state.pharmacists.findIndex(x => x.addr === selected[i]);
        await this.props.contract.methods.updatePharmacist(this.state.pharmacists[_index].name, this.state.pharmacists[_index].prn, this.state.pharmacists[_index].clinicName, this.state.pharmacists[_index].clinicAddress, this.state.pharmacists[_index].addr).send({ from: this.props.account })
      };
    };
    await this.setState({ isEdit: false, selected: [] });
    alert("Change(s) saved successfully");
  };

  //function to handle delete
  handleDelete = async (event) => {
    let selected = this.state.selected;
    if (this.state.view === 'patients') {
      for (let i = 0; i < selected.length; i++) {
        await this.props.contract.methods.removePatient(selected[i]).send({ from: this.props.account });
      };
    };
    if (this.state.view === 'prescribers') {
      for (let i = 0; i < selected.length; i++) {
        await this.props.contract.methods.removePrescriber(selected[i]).send({ from: this.props.account });
      };
    };
    if (this.state.view === 'pharmacists') {
      for (let i = 0; i < selected.length; i++) {
        await this.props.contract.methods.removePharmacist(selected[i]).send({ from: this.props.account });
      };
    };
    await this.setState({ selected: [] });
    alert("User(s) deleted successfully");
  };

  render() {
    const patientRows = this.state.patients;
    const prescriberRows = this.state.prescribers;
    const pharmacistRows = this.state.pharmacists;
    const view = this.state.view;
    const { classes } = this.props;
    const numSelected = this.state.selected.length;
    const isEdit = this.state.isEdit;

    return (
      <TableContainer component={Paper}>
        <Box m={2}>
          <Grid container
            direction="row"
            justify="space-between"
            alignItems="flex-end"
          >
            <Grid item>
              <TextField
                style = {{width: 200}}
                id="userType"
                select
                label="User Type"
                value={view}
                onChange={this.handleChange}
              >
                {options.map((option) => (
                  <MenuItem
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item
              direction="row"
              justify="flex-end"
            >
              {isEdit &&
                <Button
                  variant="outlined"
                  startIcon={<SaveIcon />}
                  onClick={ this.handleSave }
                >
                  Save
                </Button>
              }
              {numSelected > 0 && !isEdit &&
                <Button
                  variant="outlined"
                  startIcon={<EditIcon />}
                  onClick={() => {
                    this.setState({ isEdit: true });
                  }}
                >
                  Edit
                </Button>
              }
              {" "}
              {numSelected > 0 &&
                <Button
                  variant="outlined"
                  startIcon={<DeleteIcon />}
                  onClick={ this.handleDelete }
                >
                  Delete
                </Button>
              }
              {numSelected === 0 &&
                <Button
                  variant="outlined"
                  startIcon={<AddBoxIcon />}
                  onClick={() => history.push({
                    pathname: '/AddUser',
                    state: {
                      view: this.state.view
                    }
                  })}
                >
                  Add
                </Button>
              }
            </Grid>
          </Grid>
        </Box>

        <Table
          className={classes.table}
          aria-label="admin table"
        >
          <TableHead>
            <TableRow>
              <TableCell>
              </TableCell>
              <TableCell align='right'>
                Name
              </TableCell>
              {view === 'prescribers' &&
                <TableCell align='right'>
                  MCR No.
                </TableCell>
              }
              {view === 'patients' &&
                <TableCell align='right'>
                  IC No.
                </TableCell>
              }
              {view === 'pharmacists' &&
                <TableCell align='right'>
                  PRN No.
                </TableCell>
              }

              {(view === 'prescribers' || view === 'pharmacists') &&
                <TableCell align='right'>
                  Clinic Name
                </TableCell>
              }
              {(view === 'patients') &&
                <TableCell align='right'>
                  Clinic Name
                </TableCell>
              }

              {(view === 'prescribers' || view === 'pharmacists') &&
                <TableCell align='right'>
                  Clinic Address
                </TableCell>
              }
              {(view === 'patients') &&
                <TableCell align='right'>
                  Home Address
                </TableCell>
              }

              <TableCell align='right'>
                Wallet Address
              </TableCell>
            </TableRow>
          </TableHead>

          {view === 'prescribers' &&
            <TableBody>
              {prescriberRows.map((row) => (
                <PrescriberTableRow
                  key={row.addr}
                  row={row}
                  handleClick={this.handleClick}
                  isSelected={this.isSelected}
                  isEdit={this.state.isEdit}
                  handleEdit={this.handleEdit}
                />
              ))}
            </TableBody>
          }
          {view === 'patients' &&
            <TableBody>
              {patientRows.map((row, index) => (
                <PatientTableRow
                  key={row.addr}
                  row={row}
                  handleClick={this.handleClick}
                  isSelected={this.isSelected}
                  isEdit={this.state.isEdit}
                  handleEdit={this.handleEdit}
                />
              ))}
            </TableBody>
          }
          {view === 'pharmacists' &&
            <TableBody>
              {pharmacistRows.map((row) => (
                <PharmacistTableRow
                  key={row.addr}
                  row={row}
                  handleClick={this.handleClick}
                  isSelected={this.isSelected}
                  isEdit={this.state.isEdit}
                  handleEdit={this.handleEdit}
                />
              ))}
            </TableBody>
          }
        </Table>
      </TableContainer>
    );
  };
};

export default withStyles(useStyles)(Admin);
