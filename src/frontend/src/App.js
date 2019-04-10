import React, { Component } from 'react';
import './App.css';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

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
      showResultMarkers: false,
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
        showResultMarkers: true,
      });
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

  deleteUser = (index) => {
    let newMarkers = clone(this.state.markers);
    newMarkers.splice(index, 1);

    this.setState({
      markers: newMarkers,
      selectedMarker: this.state.userNum-2,
      userNum: this.state.userNum-1
    });

  }

  render() {
    const { classes } = this.props;
    return (

      <div className={classes.root}>
        <Table className={classes.table}>
          <TableBody height = '100%'>
              <TableRow>
                <TableCell component="th" scope="row" className={classes.info}>
                <FindBox users={this.state.markers} selectMarker={this.selectMarker} newUser= {this.newUser} userNum={this.state.userNum} changeLoc={this.changeLoc} areas={this.state.resultAreas} findLoc={this.findLoc} showResult={this.state.showResultMarkers} deleteUser={this.deleteUser}/>
                </TableCell>
                <Map markers={this.state.showResultMarkers ? this.state.resultAreas : this.state.markers} setMarker={this.setMarker} selectedMarker={this.state.selectedMarker} showResult={this.state.showResultMarkers} />
              </TableRow>
          </TableBody>
        </Table>
      </div>
    )
  }
};

const AppStyles = theme => ({
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

export default withStyles(AppStyles)(MainTable);
