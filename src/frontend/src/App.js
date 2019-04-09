import React, { Component } from 'react';
import './App.css';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import AddBoxIcon from '@material-ui/icons/AddBox';

const axios = require('axios');

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
});

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      usernum : 0,
      users : [],
      areas : []
    };
  };

  senddata = () => {
    let transportAPI = 'http://localhost/api/v1/findRoute/findLoc/';

    axios({
      method: 'post',
      url: 'http://localhost/api/v1/findRoute/findLoc/',
      data: {
        startLocs: this.state.users,
        exam: 1,
      }
    }).then((res) => {
      this.setState({
        areas : res.data.areas,
      });
      console.log(this.state.areas);
    }).catch((err) => {
      console.log(err);
    });

    return ;
  };

  makeuser = () => {
    let users = this.state.users;
    users.push({
      location : {
        lat: "",
        lng: ""
      },
      transportation: "public"
    });
    this.setState({
      usernum: this.state.usernum+1,
      users: users
    });

    console.log(this.state.users);

    return ;
  }

  handleChange = (e) => {
    let users = this.state.users;

    if (e.target.name == "transportation") {
      users[e.target.id].transportation = e.target.value;
    } else if (e.target.name != "transportation") {
      users[e.target.id].location[e.target.name] = e.target.value;
    }

    this.setState({
      users: users
    });
  }

  makeInput() {
    let output = [];

    for (var i =0; i < this.state.usernum; i++) {
      output.push(
        <div>
          <p> {'user' + (i+1)} </p>
          <div>
            <div> latitude : <input type="text" name="lat" id={i} value={this.state.users[i].location.lat} onChange={this.handleChange} /></div>
            <div> longitude : <input type="text" name="lng" id={i} value={this.state.users[i].location.lng} onChange={this.handleChange} /></div>
            <select onChange={this.handleChange}>
              <option name="transportation" id={i} value="public">public</option>
              <option name="transportation" id={i} value="driving">driving</option>
            </select>
          </div>
        </div>
      )
    }

    return output;
  };

  showResult() {
    let result = this.state.areas;
    let output = [];

    for (var i=0; i < this.state.areas.length; i++) {
      output.push(
        <div>
          <h1>{(i+1) + '번째 추천지역 : ' + this.state.areas[i].name}</h1>
          <div>latitude : {this.state.areas[i].location.coordinates[0]} longitude : {this.state.areas[i].location.coordinates[1]}</div>
          <div>
            {this.showUsersResult(i)}
          </div>

        </div>
      )
    };

    return output;

  };

  showUsersResult(areaNum) {
    let output = [];

    for (var i=0; i<this.state.areas[areaNum].users.length; i++) {
      output.push(
        <div>
          <h2>{(i+1) + "번째 유저"}</h2>
          <div>{"소요시간" + this.state.areas[areaNum].users[i].duration}</div>
          <div>{"거리" + this.state.areas[areaNum].users[i].distance}</div>
        </div>
      )

      for (var j =0; j<this.state.areas[areaNum].users[i].route.length; j++) {
        output.push(
          <div>{(j+1) + ". " + (this.state.areas[areaNum].users[i].route[j].transportation == "driving" ? this.state.areas[areaNum].users[i].route[j].name : this.state.areas[areaNum].users[i].route[j].startName)}</div>
        )

        console.log(this.state.areas[areaNum].users[i].route[j]);
      }

    }

    return output;

  };

  render() {
    return (
      <div>
        <div>
          {this.showResult()}
        </div>
        <div>
        <h5> 테스트용으로 사용해보세요 </h5>
        <h5>37.610693 127.003983</h5>
        <h5>37.510775 126.936916</h5>
        <h5>37.479523 126.984711</h5>
        </div>
        <div>
          {this.makeInput()}
        </div>
        <div>
          <IconButton color = 'primary' onClick={this.makeuser} aria-label="Make users">
            <AddBoxIcon />
          </IconButton> 
          <IconButton color = "secondary" onClick={this.senddata} aria-label="Send data">
            <SearchIcon />
          </IconButton>
        </div>
      </div>
    );
  }
}

function MainTable(props) {
  const { classes } = props;

  return (
    <div className={classes.root}>
      <Table className={classes.table}>
        <TableBody height = '100%'>
            <TableRow >
              <TableCell component="th" scope="row" className= {classes.info}>
              <App></App>
              </TableCell>
              <TableCell  className = {classes.map}>Map</TableCell>
            </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}

MainTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MainTable);
