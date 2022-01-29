import React, { Component } from "react";
import {
  Button,
  Box,
  Grid,
  MenuItem,
  TextField,
} from "@material-ui/core";

import history from './../history';

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

class AddUser extends Component {

  state = {
    userType: '',
    name: '',
    ic: '',
    mcr: '',
    prn: '',
    birthDate: null,
    homeAddress: '',
    clinicName: '',
    clinicAddress: '',
    addr: '',
    errormessage: '',
  };

  componentDidMount = async () => {
    let _userType = await this.props.location.state.view;
    console.log(_userType);
    await this.setState({userType: _userType});
  };

  //submit new user to blockchain
  handleAdd = async (event) => {
    let _userType = this.state.userType;

    if (_userType === "prescribers") {
      await this.props.contract.methods.setPrescriber(this.state.name, this.state.mcr, this.state.clinicName, this.state.clinicAddress, this.state.addr).send({ from: this.props.account })
    }
    if (_userType === "patients") {
      await this.props.contract.methods.setPatient(this.state.name, this.state.ic, this.state.birthDate, this.state.homeAddress, this.state.addr).send({ from: this.props.account })
    }
    if (_userType === "pharmacists") {
      await this.props.contract.methods.setPharmacist(this.state.name, this.state.prn, this.state.clinicName, this.state.clinicAddress, this.state.addr).send({ from: this.props.account })
    }
    alert("User added successfully");
    await history.push({ pathname: '/Admin' });
  }

  //function to handle change in text field
  handleChange = async (event) => {
    const { name, value } = event.target;
    let _err = '';
    if (name === "birthDate") {
      if (value !=="" && !Number(value)) {
        _err = <strong>Birth Date is invalid</strong>;
      }
    }
    await this.setState({ errormessage: _err });
    await this.setState({ [name]: value });
  };

  //function to handle reset of drug rows
  handleReset = async () => {
    await this.setState({
      name: '',
      ic: '',
      mcr: '',
      prn: '',
      birthDate: null,
      homeAddress: '',
      clinicName: '',
      clinicAddress: '',
      addr: '',
    });
  };

  render() {
    const _userType = this.state.userType;

    return (
      <form>
        <Box m={2}>
          <Grid container
            direction={"row"}
            spacing={5}
          >
            <Grid item>
              <TextField
                style = {{width: 200}}
                name="userType"
                select
                label="User Type"
                value={this.state.userType}
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
          </Grid>

          {_userType === 'prescribers' &&
            <Grid container
              direction={"row"}
              spacing={5}
            >
              <Grid item>
                <TextField
                  name="name"
                  label="Name"
                  value={this.state.name}
                  onChange={this.handleChange}
                />
              </Grid>
              <Grid item>
                <TextField
                  name="mcr"
                  label="MCR No."
                  value={this.state.mcr}
                  onChange={this.handleChange}
                />
              </Grid>
              <Grid item>
                <TextField
                  name="clinicName"
                  label="Clinic Name"
                  value={this.state.clinicName}
                  onChange={this.handleChange}
                />
              </Grid>
              <Grid item>
                <TextField
                  name="clinicAddress"
                  label="Clinic Address"
                  value={this.state.clinicAddress}
                  onChange={this.handleChange}
                />
              </Grid>
              <Grid item>
                <TextField
                  name="addr"
                  label="Wallet Address"
                  value={this.state.addr}
                  onChange={this.handleChange}
                />
              </Grid>
            </Grid>
          }

          {_userType === 'patients' &&
            <Grid container
              direction={"row"}
              spacing={5}
            >
              <Grid item>
                <TextField
                  name="name"
                  label="Name"
                  value={this.state.name}
                  onChange={this.handleChange}
                />
              </Grid>
              <Grid item>
                <TextField
                  name="ic"
                  label="IC No."
                  value={this.state.ic}
                  onChange={this.handleChange}
                />
              </Grid>
              <Grid item>
                <TextField
                  name="birthDate"
                  label="Date of Birth"
                  value={this.state.birthDate}
                  onChange={this.handleChange}
                />
              </Grid>
              <Grid item>
                <TextField
                  name="homeAddress"
                  label="Home Address"
                  value={this.state.homeAddress}
                  onChange={this.handleChange}
                />
              </Grid>
              <Grid item>
                <TextField
                  name="addr"
                  label="Wallet Address"
                  value={this.state.addr}
                  onChange={this.handleChange}
                />
              </Grid>
            </Grid>
          }

          {_userType === 'pharmacists' &&
          <Grid container
            direction={"row"}
            spacing={5}
          >
            <Grid item>
              <TextField
                name="name"
                label="Name"
                value={this.state.name}
                onChange={this.handleChange}
              />
            </Grid>
            <Grid item>
              <TextField
                name="prn"
                label="PRN No."
                value={this.state.prn}
                onChange={this.handleChange}
              />
            </Grid>
            <Grid item>
              <TextField
                name="clinicName"
                label="Clinic Name"
                value={this.state.clinicName}
                onChange={this.handleChange}
              />
            </Grid>
            <Grid item>
              <TextField
                name="clinicAddress"
                label="Clinic Address"
                value={this.state.clinicAddress}
                onChange={this.handleChange}
              />
            </Grid>
            <Grid item>
              <TextField
                name="addr"
                label="Wallet Address"
                value={this.state.addr}
                onChange={this.handleChange}
              />
            </Grid>
          </Grid>
          }

        </Box>

        <Button onClick={() => this.handleAdd()}> {/*run handleAdd*/}
          Add
        </Button>
        <Button variant={"outlined"} onClick={() => this.handleReset()}> {/*run handleReset*/}
          Reset
        </Button>
      </form>
    );
  };
}

export default AddUser;
