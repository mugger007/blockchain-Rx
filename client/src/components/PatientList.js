import React, {
  Component,
  useState
} from "react";
import { withStyles } from '@material-ui/core/styles';
import {
  Box,
  Button,
  Collapse,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@material-ui/core";
import IconButton from '@material-ui/core/IconButton';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import CancelIcon from '@material-ui/icons/Cancel';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';

import history from './../history';

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

const useStyles = theme => ({
  root: {
    width: '100%',
    overflowX: 'auto'
  },
  table: {
    minWidth: 650
  }
});

class PatientList extends Component {

  state = {
    patients: [], //array of patient attributes
    patientList: [], //list of patient addr
    prescriberAddr: '',
    prescriberName: '',
    userType: '',
    account: '',
  };

  componentDidMount = async () => {
    let _userType = await this.props.location.userType;
    let _account = await this.props.account;
    await this.setState({
      account: _account,
      userType: _userType
    });
    //get list of patient addr
    console.log('Getting patient list');
    let _patientList = await this.props.contract.methods.getPatientList().call();
    console.log('Got patient list');
    _patientList = Object.values(_patientList);
    await this.setState({ patientList: [...this.state.patientList, ..._patientList] })

    let _prescriberName = await this.props.contract.methods.getPrescriberName(this.state.account).call();
    await this.setState({
      prescriberName: _prescriberName,
      prescriberAddr: this.state.account,
    });

    //get patient details from patientStructs
    for (let i = 0; i < _patientList.length; i++) {
      let _patient = await this.props.contract.methods.patientStructs(_patientList[i]).call();
      let _name = _patient.name;
      let _ic = _patient.ic;
      let _birthDate = _patient.birthDate;
      let _homeAddress = _patient.homeAddress;
      let _addr = _patient.addr;
      let _valid = _patient.valid;
      let newPatients = [...this.state.patients]; //make shallow copy of patients

      if (_valid) {
        newPatients.push({
          name: _name,
          ic: _ic,
          birthDate: _birthDate,
          homeAddress: _homeAddress,
          addr: _addr,
          valid: _valid,
          details: []
        }); //push new entry into patients' copy
        let newPatient = {...newPatients[i]}; //make shallow copy of patient
        //get patient prescription overview from getPatientPrescrptionOverview
        let _patientPrescriptionList = await this.props.contract.methods.getPatientPrescrptionList(_patientList[i]).call();

          for (let j = 0; j < _patientPrescriptionList.length; j++) {
            let _patientPrescriptionOverview = await this.props.contract.methods.getPatientPrescrptionOverview(_patientPrescriptionList[j]).call();
            console.log(_patientPrescriptionOverview);
            let _prescriptionKey = _patientPrescriptionList[j];
            let _date = _patientPrescriptionOverview[0];
            let _prescriberName = _patientPrescriptionOverview[1];
            let _prescriberClinic = _patientPrescriptionOverview[2];
            let _valid = _patientPrescriptionOverview[3];
            let _reviewed = _patientPrescriptionOverview[4];

            newPatient.details.push({
              prescriptionKey: _prescriptionKey,
              date: _date,
              prescriberName: _prescriberName,
              prescriberClinic: _prescriberClinic,
              valid: _valid,
              reviewed: _reviewed
            }); //push new entry into patient's details
          };
        newPatients[i] = newPatient;
      };
      this.setState({ patients: newPatients }); //update patients state
    };

    console.log(this.state.patients);
  };

  render() {
    const rows = this.state.patients;
    const { classes } = this.props;

    const ExpandableTableRow = (props) => {
      const { row } = props;
      const [open, setOpen] = useState(false);
      return (
        <React.Fragment>
          <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
            <TableCell>
              <IconButton
                aria-label="expand row"
                size="small"
                onClick={() => setOpen(!open)}
              >
                {open ?
                  <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />
                }
              </IconButton>
            </TableCell>
            <TableCell component="th" scope="row">
              {row.ic}
            </TableCell>
            <TableCell align="right">
              {row.name}
            </TableCell>
            <TableCell align="right">
              {row.birthDate}
            </TableCell>
            <TableCell align="right">
              {row.homeAddress}
            </TableCell>
            <TableCell align="right">
              {row.addr}
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell
              style={{
                paddingBottom: 0,
                paddingTop: 0
              }}
              colSpan={6}
            >
              <Collapse
                in={open}
                timeout="auto"
                unmountOnExit
              >
                <Box sx={{ margin: 1 }}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    component="div"
                  >
                    Prescriptions
                  </Typography>
                  <Table
                    size="small"
                    aria-label="purchases"
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          Date
                        </TableCell>
                        <TableCell align="right">
                          Prescriber Name
                        </TableCell>
                        <TableCell align="right">
                          Clinic
                        </TableCell>
                        <TableCell align="right">
                          Valid
                        </TableCell>
                        <TableCell align="right">
                          Reviewed
                        </TableCell>
                        <TableCell>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {row.details.map((RxRow) => (
                        <TableRow key={RxRow.date}>
                          <TableCell
                            component="th"
                            scope="row"
                          >
                            {timeConverter(RxRow.date)}
                          </TableCell>
                          <TableCell align="right">
                            {RxRow.prescriberName}
                          </TableCell>
                          <TableCell align="right">
                            {RxRow.prescriberClinic}
                          </TableCell>
                          <TableCell align="right">
                            {RxRow.valid ?
                              <CheckCircleIcon /> : <CancelIcon />
                            }
                          </TableCell>
                          <TableCell align="right">
                            {RxRow.reviewed ?
                              <CheckCircleIcon /> : <CancelIcon />
                            }
                          </TableCell>
                          <TableCell align="right">
                            <Button
                              variant="contained"
                              onClick={() => history.push({
                                pathname: '/Prescription',
                                state: {
                                  data: RxRow,
                                  patientData: row,
                                }
                              })}
                            > {/*redirect to Prescription*/}
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <div>
                    <Button
                      color="primary"
                      autoFocus
                      onClick={() => history.push({
                        pathname: '/AddPrescription',
                        state: {
                          patientData: row,
                          prescriberName: this.state.prescriberName,
                          prescriberAddr: this.state.prescriberAddr,
                        }
                      })}
                    > {/*redirect to AddPrescription*/}
                      New
                    </Button>
                  </div>
                </Box>
              </Collapse>
            </TableCell>
          </TableRow>
        </React.Fragment>
      );
    }

    return (
      <Paper className={classes.root}>
        <Table
          className={classes.table}
          aria-label="simple table"
        >
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox" />
              <TableCell>
                IC
              </TableCell>
              <TableCell align="right">
                Name
              </TableCell>
              <TableCell align="right">
                Birth Date
              </TableCell>
              <TableCell align="right">
                Home Address
              </TableCell>
              <TableCell align="right">
                Wallet Address
              </TableCell>
            </TableRow>
          </TableHead>
          {this.state.userType === 'patient' ?
            (
              <TableBody>
                {rows.filter((item, index) => index === this.state.patientList.indexOf(this.state.account)).map(row => (
                  <ExpandableTableRow
                    key={row.name}
                    row={row}
                  />
                ))}
              </TableBody>
            ) : (
              <TableBody>
                {rows.map((row) => (
                  <ExpandableTableRow
                    key={row.name}
                    row={row}
                  />
                ))}
              </TableBody>
            )
          }
        </Table>
      </Paper>
    );
  }
}
export default withStyles(useStyles)(PatientList);
