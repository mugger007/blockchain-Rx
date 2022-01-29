import React, { Component } from "react";
import {
  Box,
  Typography
} from "@material-ui/core";

export default class Home extends Component {
  render() {
    return (
      <Box m={2}>
        <Typography
          variant="h6"
          align="center"
        >
          Your address: {this.props.account}
        </Typography>
        <Typography align="center">
          You can access as: {this.props.userType}
        </Typography>
      </Box>
    );
  };
};
