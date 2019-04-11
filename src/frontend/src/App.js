import React, { Component } from 'react';
import './App.css';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import IconButton from '@material-ui/core/IconButton';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import SearchIcon from '@material-ui/icons/Search';
import AddBoxIcon from '@material-ui/icons/AddBox';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import Map from './Map';
import FindBox from './FindBox';

const axios = require('axios');

function clone(a) {
   return JSON.parse(JSON.stringify(a));
}

class MainTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isMarkerShown: true,
      markers: [{
        location : {
          lat: 0,
          lng: 0
        },
        transportation: "public"
      }],
      selectedMarker: 0,
      userNum: 1,
      resultAreas: []
    }
  };


  findLoc = () => {
    let transportAPI = 'http://13.209.137.246/api/v1/findRoute/findLoc/';

    axios({
      method: 'post',
      url: 'http://13.209.137.246/api/v1/findRoute/findLoc/',
      data: {
        startLocs: this.state.markers,
      }
    }).then((res) => {
      this.setState({
        resultAreas : res.data.areas,
      });
      console.log(this.state.resultAreas);
    }).catch((err) => {
      console.log(err);
    });

    return ;
  };

  setMarker = (direction) => {
    if(this.state.selectedMarker == -1) return;

    let newMarkers = clone(this.state.markers);

    newMarkers[this.state.selectedMarker].location={
          lat: direction.lat,
          lng: direction.lng
    };

    this.setState({
      markers: newMarkers
    });
  };

  newUser = () => {
    let markers = this.state.markers.concat({
      location : {
        lat: 0,
        lng: 0
      },
      transportation: "public"
    });

    this.setState({
      userNum: this.state.userNum+1,
      markers: markers,
      selectedMarker: this.state.userNum
    });
  }

  selectMarker = (index) => {
    this.setState({
      selectedMarker: index
    });
  };

  changeLoc = (direction) => {
    if(this.state.selectedMarker == -1) return;

    let newMarkers = clone(this.state.markers);

    if (direction.name == "transportation") {
      newMarkers[direction.index].transportation = direction.value;
    } else if (direction.name != "transportation") {
      newMarkers[direction.index].location[direction.name] = direction.value;
    }

    this.setState({
      markers: newMarkers
    });
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Table className={classes.table}>
          <TableBody height = '100%'>
              <TableRow >
                <TableCell component="th" scope="row" className={classes.info}>
                <FindBox users={this.state.markers} selectMarker={this.selectMarker} newUser= {this.newUser} userNum={this.state.userNum} changeLoc={this.changeLoc} areas={this.state.resultAreas} findLoc={this.findLoc}/>
                </TableCell>
                <Map users={this.state.markers} setMarker={this.setMarker} selectedMarker={this.state.selectedMarker} />
              </TableRow>
          </TableBody>
        </Table>
      </div>
    )
  }
};

const styles = theme => ({
  root: {
    width: '100%',
    height: '100%',
    overflowX: 'auto',
    backgroundColor: '#FAFAFA',
  },
  table: {
    height: '100%',
  },
  info: {
    width: 300,
    verticalAlign: 'top',
  },
  map: {
    minWidth: 300,
    backgroundColor: '#CEF6D8',
  },
  displayInput: {
    display: 'block',
  },
});

MainTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MainTable);
