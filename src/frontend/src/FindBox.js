import React, { Component } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { withStyles, Icon, IconButton,
         ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails,
         Typography, Paper, Divider} from '@material-ui/core/';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import SearchIcon from '@material-ui/icons/Search';
import AddBoxIcon from '@material-ui/icons/AddBox';
import RemoveIcon from '@material-ui/icons/RemoveCircle';
import PinDropIcon from '@material-ui/icons/PinDrop';
import DirectionsBus from '@material-ui/icons/DirectionsBus';
import DirectionsCar from '@material-ui/icons/DirectionsCar';
import DirectionsSubway from '@material-ui/icons/DirectionsSubway';
import DirectionsWalk from '@material-ui/icons/DirectionsWalk';


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
    const { classes } = this.props;

    for (let i =0; i < this.props.userNum; i++) {
      userLocBox.push(
        <div>
          <Paper>
            <div className={classes.inputBox}>
              <Typography >
            <p> {'user' + (i+1)} </p>
            <div>
              <table width='100%'>
              <td>
              latitude : <input type="text" size = '16' name="lat" id={i} value={this.props.users[i].location.lat} onChange={this.handleChange} /><br></br>
              longitude : <input type="text" size = '14' name="lng" id={i} value={this.props.users[i].location.lng} onChange={this.handleChange} />
              </td>
              <td className={classes.inputBoxDeleteIcon}>
              <IconButton color = "secondary" onClick={() => this.props.deleteUser(i)} aria-label="Remove user" >
                <RemoveIcon />
              </IconButton>
              </td>
              </table>
            </div>
              <select onChange={this.handleChange} id ={i} name="transportation">
                <option value="public">public</option>
                <option value="driving">driving</option>
              </select>
              <IconButton color = "secondary" onClick={() => this.props.selectMarker(i)} aria-label="Select location">
                <PinDropIcon />
              </IconButton>
              </Typography>
              </div>
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
    const { classes } = this.props;

    for (let i=0; i < this.props.areas.length; i++) {
      candidatesBox.push(
        <div>
          <ExpansionPanel>
            <ExpansionPanelSummary expandIcon = { <ExpandMoreIcon />}>
              <table>
                <td className= {classes.resultBoxVerticalAlign}><h2>{'[추천 ' + (i+1) + '] '}</h2></td>
                <td><h1>{' ' + this.props.areas[i].name}</h1></td>
              </table>
            </ExpansionPanelSummary>
            <hr className = {classes.resultBoxDetailsLine}></hr>
            <ExpansionPanelDetails>
            <Divider />
                <div>
                  {this.showUserRouteResult(i)}
                </div>
            </ExpansionPanelDetails>
          </ExpansionPanel>
          <Divider />
          <br></br>
        </div>
      )
    };

    return candidatesBox;
  };

  showUserRouteResult(areaNum) {
    let userRouteBox = [];
    const { classes } = this.props;

    for (let i=0; i<this.props.areas[areaNum].users.length; i++) {
      userRouteBox.push(
        <div>
          <h2 className= {classes.resultBoxDetailsUser}>{(i+1) + "번째 유저"}</h2>
          {this.walking(this.props.areas[areaNum].users[i])}
          <div>{"소요시간 : " + this.props.areas[areaNum].users[i].duration}</div>
          <div>{"거리 : " + this.props.areas[areaNum].users[i].distance}</div>
        </div>
      )

      for (let j =0; j<this.props.areas[areaNum].users[i].route.length; j++) {
        userRouteBox.push(
          <div>
            {(j+1) + ". "}
            {(this.showTransportationIcon(this.props.areas[areaNum].users[i].route[j]))}
          </div>
        )
      }
      userRouteBox.push(
        <br></br>
      )
    }

    return userRouteBox;
  };

  showButton() {
    return (
      <div>
      <table width="100%">
      <td>
        <IconButton color = 'primary' onClick={() => this.props.newUser()} aria-label="Make users">
          <AddBoxIcon />
        </IconButton>
        </td>
        <td align="right">
        <IconButton color = "secondary" onClick={() => this.props.findLoc()} aria-label="Send data">
          <SearchIcon />
        </IconButton>
        </td>
        </table>
      </div>
    )
  }

  walking(trans){
    if(trans.route == ''){
      return(
        <div>
          <Icon><DirectionsWalk /></Icon>
        </div>
      )
    }
  }

  showTransportationIcon(trans){
    if (trans.transportation == "driving"){
      return (
        <div>
          <Icon><DirectionsCar /></Icon>
          {trans.name}
        </div>
      );
    }
    else if (trans.transportation == "bus") {
      return (
        <div>
          {" ( "}
          <Icon><DirectionsBus /></Icon>
          {" "}
          {trans.lineNum}
          {" ) "}
          {trans.startName}
          {" -> "}
          {trans.endName}
        </div>
      );
    }
    else{
      return (
        <div>
          {" ( "}
          <Icon><DirectionsSubway /></Icon>
          {" "}
          {trans.lineNum}
          {" ) "}
          {trans.startName}
          {" -> "}
          {trans.endName}
        </div>
      );
    }
  }

  render() {
    return (
      <div>
      {this.props.showResult ? (<div></div>) : (this.showButton())}
      <Scrollbars style={{ width: "110%", height: 550 }}>
        <div>
          {this.props.showResult ? this.showCandidateResult() : this.userLocBox()}
        </div>
        </Scrollbars>

      </div>
    );
  }
}

const FindBoxStyles = theme => ({
  inputBox: {
    paddingTop: 1,
    borderTopWidth: 10,
    paddingLeft: 17,
    paddingBottom: 15,
    marginTop:5,
  },
  inputBoxDeleteIcon: {
    textAlign: 'right',
    verticalAlign: 'middle',
    position: 'relative',
    top: -3,
  },
  resultBoxVerticalAlign: {
    verticalAlign: 'middle',
  },
  resultBoxDetailsLine: {
    marginTop:0,
    marginBottom: 0,
    width: 260,
    align:'center',
  },
  resultBoxDetailsUser: {
    marginTop:8,
    marginBottom: 4,
  },
});

export default withStyles(FindBoxStyles)(FindBox);
