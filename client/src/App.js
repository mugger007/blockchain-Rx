import React, { Component } from "react";
import {
  Redirect,
  Route,
  Router,
  Switch,
} from "react-router-dom";
import Rx from "./contracts/Rx.json";
import getWeb3 from "./getWeb3";

import AddUser from "./components/AddUser";
import PatientList from "./components/PatientList";
import Prescription from "./components/Prescription";
import AddPrescription from "./components/AddPrescription";
import Home from "./components/Home";
import Admin from "./components/Admin";

import history from './history';
import NavBar from './NavBar';

export default class App extends Component {

  state = {
    web3: null,
    account: null,
    contract: null,
    admin: null,
    patientList: null,
    prescriberList: null,
    pharmacistList: null,
    userType: []
  };

  componentDidMount = async () => {
    try {
      //get network provider and web3 instance.
      const web3 = await getWeb3();
      //use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();
      //get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = Rx.networks[networkId];
      const instance = new web3.eth.Contract(
        Rx.abi,
        deployedNetwork && deployedNetwork.address,
      );
      //set web3, accounts, and contract to the state, and then proceed with an
      //example of interacting with the contract's methods.
      await this.setState({
        account: accounts[0],
        contract: instance,
      });
    } catch (error) {
      //catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    };

    //get list of admin, patients, prescribers and pharmacists
    let _admin = await this.state.contract.methods.getAdmin().call();
    let _patientList = await this.state.contract.methods.getPatientList().call();
    let _prescriberList = await this.state.contract.methods.getPrescriberList().call();
    let _pharmacistList = await this.state.contract.methods.getPharmacistList().call();
    await this.setState({
      admin: _admin,
      patientList: _patientList,
      prescriberList: _prescriberList,
      pharmacistList: _pharmacistList
    });

    //check user type
    if (_admin.indexOf(this.state.account) > -1) {
      await this.setState({
        userType: this.state.userType.concat('admin')
      });
    };
    if (_patientList.indexOf(this.state.account) > -1) {
      await this.setState({
        userType: this.state.userType.concat('patient')
      });
    };
    if (_prescriberList.indexOf(this.state.account) > -1) {
      await this.setState({
        userType: this.state.userType.concat('prescriber')
      });
    };
    if (_pharmacistList.indexOf(this.state.account) > -1) {
      await this.setState({
        userType: this.state.userType.concat('pharmacist')
      });
    };

    console.log(this.state.userType);
  };

  render() {
    return (
      <div>
        <NavBar userType={this.state.userType}/>
        <Router history={history}>
          <Switch>
            <Route
              exact
              path="/Home"
              render={(props) =>
              (<Home {...props}
                contract={this.state.contract}
                account={this.state.account}
                userType={this.state.userType}
              />)}
            />
            <Route
              exact
              path="/AddUser"
              render={(props) =>
              (<AddUser {...props}
                contract={this.state.contract}
                account={this.state.account}
              />)}
            />
            <Route
              exact
              path="/PatientList"
              render={(props) =>
              (<PatientList {...props}
                contract={this.state.contract}
                account={this.state.account}
              />)}
            />
            <Route
              exact
              path="/Prescription"
              render={(props) =>
              (<Prescription {...props}
                contract={this.state.contract}
                account={this.state.account}
              />)}
            />
            <Route
              exact
              path="/AddPrescription"
              render={(props) =>
              (<AddPrescription {...props}
                contract={this.state.contract}
                account={this.state.account}
              />)}
            />
            <Route
              exact
              path="/Admin"
              render={(props) =>
              (<Admin {...props}
                contract={this.state.contract}
                account={this.state.account}
              />)}
            />
            <Route
              exact
              path="/*"
              render={() => {
                return (
                  <Redirect to={{
                    pathname: '/Home'
                  }}/>
                )
              }}
            />
          </Switch>
        </Router>
      </div>
    )
  }
}
