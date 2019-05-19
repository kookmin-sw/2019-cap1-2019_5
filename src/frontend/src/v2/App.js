import React, { Component } from 'react';
import './App.css';
import PropTypes from 'prop-types';
import LoadingWindow from './LoadingWindow';
import Map from './Map';
import FindBox from './FindBox';
import MakeRoom from './MakeRoom';
import PrivateRoom from './PrivateRoom';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Meeting from './Meeting';

const { SearchBox } = require("react-google-maps/lib/components/places/SearchBox");
const axios = require('axios');

function clone(a) {
   return JSON.parse(JSON.stringify(a));
}

class App extends React.Component {
  constructor(props) {
    super(props);
  };


  render() {
    window.Kakao.init('23abfbfc99a7cd6eb09c2984417716c8');
    return (
      <Router>
        <Route exact path="/" component={MakeRoom} />
        <Route path="/meeting/:token" component={Meeting} />
      </Router>
    )
  }
};


export default App;
