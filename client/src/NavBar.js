import React from "react";

import {
    AppBar,
    Box,
    Toolbar,
    Typography,
    IconButton,
} from "@material-ui/core";

import history from './history';

const NavBar = (props) => {

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        style={{ background: '#2E3B55' }}
      >
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            style={{ flexGrow: 1 }}
          >
            Blockchain Rx
          </Typography>

          <IconButton
            size="small"
            style={{ minWidth: '100px'}}
            onClick={() => {
              history.push('/Home');
            }}
            color="inherit"
          >
            Home
          </IconButton>

          {props.userType.indexOf("patient") > -1 &&
            <IconButton
              size="small"
              onClick={() => history.push({
                pathname: '/PatientList',
                userType: 'patient'
              })}
              color="inherit"
            >
              Prescriptions
            </IconButton>
          }

          {(props.userType.indexOf("prescriber") > -1 || props.userType.indexOf("pharmacist") > -1) &&
            <IconButton
              size="small"
              onClick={() => {
                history.push('/PatientList');
              }}
              color="inherit"
            >
              Patients
            </IconButton>
          }

          {props.userType.indexOf("admin") > -1 &&
            <IconButton
              size="small"
              onClick={() => {
                history.push('/Admin');
              }}
              color="inherit"
            >
              Users
            </IconButton>
          }
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default NavBar;
