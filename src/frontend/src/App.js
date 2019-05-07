import React, { Component } from 'react';
import './App.css';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ShareIcon from '@material-ui/icons/Share';
import SearchIcon from '@material-ui/icons/Search';

import Map from './Map';
import FindBox from './FindBox';

const { SearchBox } = require("react-google-maps/lib/components/places/SearchBox");
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
      resultAreas: [],
      swiped: false
    }

    this._onTouchStart = this._onTouchStart.bind(this);
    this._onTouchMove = this._onTouchMove.bind(this);
    this._onTouchEnd = this._onTouchEnd.bind(this);
    this._swipe = {};
    this.minDistance = 50;
    this.fmh = 50;
    this.ymp = 0;
  };


  findLoc = () => {
    let transportAPI = 'http://13.209.137.246/api/v1/findRoute/findLoc/';
    document.getElementById('loading_logo').style.display = 'block';
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
      document.getElementById('loading_logo').style.display = 'none';
    }).catch((err) => {
      console.log(err);
    });

    return ;
  };


  //하단 메뉴 터치 슬라이드 부분
  _onTouchStart(e) {
    document.getElementById('side_area').style.height = document.getElementById('side_area').clientHeight+'px';
    document.getElementById('side_area').classList.remove('ani_up');
    document.getElementById('side_area').classList.remove('ani_down');
    const touch = e.touches[0];
    this._swipe = { x: touch.clientX, y: touch.clientY, fmh_n:document.getElementById('side_area').clientHeight };
  }

  _onTouchMove(e) {
    if (e.changedTouches && e.changedTouches.length) {
      const touch = e.changedTouches[0];
      var mh = this._swipe.fmh_n + (this._swipe.y - touch.clientY);
      mh = mh < 50 ? this.fmh : mh;
      this.ymp = this._swipe.y - touch.clientY;
      document.getElementById('side_area').style.height = mh+'px';
      this._swipe.swiping = true;
    }
  }

  _onTouchEnd(e) {
    const touch = e.changedTouches[0];
    const absY = Math.abs(touch.clientY - this._swipe.y);
    if (this._swipe.swiping && absY > this.minDistance ) {
      this.props.onSwiped && this.props.onSwiped();
      this.setState({ swiped: true });
    }
    if(this.ymp < -40){
      document.getElementById('side_area').classList.add('ani_down');
    }else if(document.getElementById('side_area').clientHeight - this.fmh > 20){
      document.getElementById('side_area').classList.add('ani_up');
    }else{
      document.getElementById('side_area').classList.add('ani_down');
    }
    this._swipe = {};
  }

  setMarker = (direction) => {
    if (this.state.selectedMarker == -1) return;

    let newMarkers = clone(this.state.markers);

    newMarkers[direction.index].location={
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
                <TableCell component="th" scope="row" className={classes.info} id="side_area" onClick={this.footerMenuSlide} onTouchStart={this._onTouchStart} onTouchMove={this._onTouchMove} onTouchEnd={this._onTouchEnd}>
                <MenuIcon id="footer_menu_btn" />
                <div id="side_area_top">
                  <IconButton id="side_area_menu_btn" className={classes.menuButton} color="inherit" aria-label="Menu">
                    <MenuIcon />
                  </IconButton>
                  <IconButton id="side_area_share_btn" className={classes.shareButton} color="inherit" aria-label="Share">
                    <ShareIcon />
                  </IconButton>
                </div>
                <FindBox users={this.state.markers} selectMarker={this.selectMarker} newUser= {this.newUser} userNum={this.state.userNum} changeLoc={this.changeLoc} areas={this.state.resultAreas} findLoc={this.findLoc} showResult={this.state.showResultMarkers} deleteUser={this.deleteUser}/>
                </TableCell>
                <div id="map_area"><Map markers={this.state.showResultMarkers ? this.state.resultAreas : this.state.markers} setMarker={this.setMarker} selectedMarker={this.state.selectedMarker} showResult={this.state.showResultMarkers} /></div>
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
