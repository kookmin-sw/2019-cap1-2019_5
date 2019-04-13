import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import AddBoxIcon from '@material-ui/icons/AddBox';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Map from './Map';
import Find from './FindBox';

const axios = require('axios');

class FindBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      usernum : this.props.userNum,
      users : [],
      areas : []
    };
  };

  handleChange = (e) => {
    this.props.changeLoc({
      name: e.target.name,
      value: e.target.value,
      index: e.target.id
    });
  }

  userLocBox() {
    let userLocBox = [];

    for (let i =0; i < this.props.userNum; i++) {
      userLocBox.push(
        <div>
          <Paper>
            <TableCell>
              <Typography paragraph='true' >
            <p> {'user' + (i+1)} </p>
            <div>
              <div> latitude : <input type="text" name="lat" id={i} value={this.props.users[i].location.lat} onChange={this.handleChange} /></div>
              <div> longitude : <input type="text" name="lng" id={i} value={this.props.users[i].location.lng} onChange={this.handleChange} /></div>
              <select onChange={this.handleChange} id ={i} name="transportation">
                <option value="public">public</option>
                <option value="driving">driving</option>
              </select>
              <button onClick={() => this.props.selectMarker(i)}>Select location</button>
            </div>
              </Typography>
            </TableCell>
          </Paper>
          <br></br>
        </div>
      )
    }

    return userLocBox;
  };

  showCandidateResult() {
    let result = this.props.areas;
    let candidatesBox = [];

    for (let i=0; i < this.props.areas.length; i++) {
      candidatesBox.push(
        <div>
          <h1>{(i+1) + '번째 추천지역 : ' + this.props.areas[i].name}</h1>
          <div>latitude : {this.props.areas[i].location.coordinates[0]}</div>
          <div>longitude : {this.props.areas[i].location.coordinates[1]}</div>
          <div>
            {this.showUserRouteResult(i)}
          </div>

        </div>
      )
    };

    return candidatesBox;
  };

  showUserRouteResult(areaNum) {
    let userRouteBox = [];

    for (let i=0; i<this.props.areas[areaNum].users.length; i++) {
      userRouteBox.push(
        <div>
          <h2>{(i+1) + "번째 유저"}</h2>
          <div>{"소요시간 : " + this.props.areas[areaNum].users[i].duration}</div>
          <div>{"거리 : " + this.props.areas[areaNum].users[i].distance}</div>
        </div>
      )

      for (let j =0; j<this.props.areas[areaNum].users[i].route.length; j++) {
        userRouteBox.push(
          <div>
            {(j+1) + ". " + (this.props.areas[areaNum].users[i].route[j].transportation == "driving" ?
              this.props.areas[areaNum].users[i].route[j].name
              : " ( " + this.props.areas[areaNum].users[i].route[j].transportation + " " + this.props.areas[areaNum].users[i].route[j].lineNum + " ) " + this.props.areas[areaNum].users[i].route[j].startName + " -> " + this.props.areas[areaNum].users[i].route[j].endName)}
          </div>
        )
      }

    }

    return userRouteBox;
  };

  showButton() {
    return (
      <div>
        <IconButton color = 'primary' onClick={() => this.props.newUser()} aria-label="Make users">
          <AddBoxIcon />
        </IconButton>
        <IconButton color = "secondary" onClick={() => this.props.findLoc()} aria-label="Send data">
          <SearchIcon />
        </IconButton>
      </div>
    )
  }

  render() {
    return (
      <div>
        <div>
          {this.props.showResult ? this.showCandidateResult() : this.userLocBox()}
        </div>
        {this.props.showResult ? (<div></div>) : (this.showButton())}
      </div>
    );
  }
}

export default FindBox;
