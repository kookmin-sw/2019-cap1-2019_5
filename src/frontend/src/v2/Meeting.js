import React, { Component } from 'react';
import './Meeting.css';
import PropTypes from 'prop-types';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import LoadingWindow from './LoadingWindow';
import Map from './Map';
import PrivateRoom from './PrivateRoom';
import ResultRoom from './ResultRoom';
import { Redirect } from 'react-router-dom';
const axios = require('axios');
const serverAPI = require('../config/API_KEY.json');

function clone(a) {
   return JSON.parse(JSON.stringify(a));
}

class Meeting extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      myMarker: {
        location: {
          lat: 0,
          lng: 0,
          name: "위치를 선택해주세요!"
        },
        transportation: "public",
        name: "이름을 입력해주세요!"
      },
      meeting: {},
      meetingUsers: [],
      userNum: 1,
      resultAreas: [],
      swiped: false,
      showLoadingWindow: false,
      selectedResult: -1,
      voteArea: -1,
      searchPoint: {
        location: {
          lat: 0,
          lng: 0,
          name: ""
        },
        active: false,
        control: false
      },
    }

    this._onTouchStart = this._onTouchStart.bind(this);
    this._onTouchMove = this._onTouchMove.bind(this);
    this._onTouchEnd = this._onTouchEnd.bind(this);
    this._swipe = {};
    this.minDistance = 50;
    this.fmh = 50;
    this.ymp = 0;

  };

  componentDidMount() {
    //TODO : findmeeting
    axios({
      method: 'get',
      url: serverAPI.serverURL + serverAPI.serverVersion + 'meeting/findMeeting?token=' + this.props.match.params.token,
      data: {}
    }).then((res) => {
      this.setState({
        meeting : res.data.meeting,
        meetingUsers : res.data.meetingUsers,
        resultAreas: res.data.resultAreas
      }, () => {
        window.Kakao.Link.createDefaultButton({
          container: '#kakaoShareBtn',
          objectType: 'feed',
          content: {
            title: 'ㅁㄷㅁㅇ', //카카오톡 공유 제목영역
            description: '모임 : ' + this.state.meeting.name, //카카오톡 공유 내용영역
            imageUrl: 'http://meet-mid.s3-website.ap-northeast-2.amazonaws.com/static/media/logo.94db3323.png', //공유 이미지
            link: {
              mobileWebUrl: document.location.href,
              webUrl: document.location.href
            }
          },
          buttons: [
            {
              title: '웹으로 보기',
              link: {
                mobileWebUrl: document.location.href,
                webUrl: document.location.href
              }
            }
          ]
        });
      });
    }).catch((err) => {
      console.log(err);
      alert("잘못된 경로입니다.");
      window.location = "/";
    });


  };

  showLoadingWindow() {
    let result = [];
    if (this.state.showLoadingWindow) {
    result.push(<LoadingWindow></LoadingWindow>);
    }
    else;
    return result;
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

  setMyMarker = (direction) => {
    let newMyMarker = clone(this.state.myMarker);
    newMyMarker.location = {
      lat: direction.lat,
      lng: direction.lng,
      name: direction.where
    };

    this.setState({
      myMarker: newMyMarker
    });
  };

  setSearchPoint = (direction) => {
    let newSearchPoint = clone(this.state.searchPoint);

    newSearchPoint.location = {
      lat: direction.lat,
      lng: direction.lng,
      name: direction.where
    };

    newSearchPoint.control = false;

    this.setState({
      searchPoint: newSearchPoint
    });
  };

  clickSearchButton = (e) => {
    console.log(this.state.searchPoint);
    let newSearchPoint = clone(this.state.searchPoint);

    if( newSearchPoint.active == false && newSearchPoint.control == false) {
      newSearchPoint.active = true;
      newSearchPoint.control = true;
    } else if( newSearchPoint.active == true && newSearchPoint.control == true) {
      newSearchPoint.active = false;
      newSearchPoint.control = false;
    } else if( newSearchPoint.active == true && newSearchPoint.control == false) {
      newSearchPoint.active = false;
    }

    this.setState({
      searchPoint: newSearchPoint
    });

  };

  handleChange = (e) => {
    if (e.target.id == "user-name"){
      let newMyMarker = clone(this.state.myMarker);
      newMyMarker.name = e.target.value;
      this.setState({
        myMarker: newMyMarker
      });
    };

    if (e.target.id == "transportation") {
      let newMyMarker = clone(this.state.myMarker);
      if (e.target.checked == false) {
        newMyMarker.transportation = "public"
      } else {
        newMyMarker.transportation = "driving";
      }

      this.setState({
        myMarker: newMyMarker
      })
    }
  };

  submit = () => {
    if (this.state.myMarker.location.lat == 0) {
      alert("위치를 입력해주세요.")
      return ;
    }

    this.setState({
      showLoadingWindow : true
    });

    axios({
      method: 'post',
      url: serverAPI.serverURL + serverAPI.serverVersion + 'meeting/enrolledUser?token=' + this.props.match.params.token,
      data: {
        name: this.state.myMarker.name,
        location: [this.state.myMarker.location.lng, this.state.myMarker.location.lat],
        locationName: this.state.myMarker.location.name,
        transportation: this.state.myMarker.transportation
      }
    }).then((res) => {
      this.setState({
        showLoadingWindow : false
      });

      window.location = this.props.match.url;
    }).catch((err) => {
      console.log(err);
    });

    return ;
  };

  showResult = () => {

    this.setState({
      showLoadingWindow : true
    });

    let searchPoint = {
      location: {
        lat: 0,
        lng: 0
      }
    };

    if (this.state.searchPoint.active && this.state.searchPoint.location.lng != 0) {
      searchPoint = this.state.searchPoint;
    } else {
      for (let i = 0; i < this.state.meetingUsers.length; i++) {
        searchPoint.location.lat += this.state.meetingUsers[i].location.coordinates[1];
        searchPoint.location.lng += this.state.meetingUsers[i].location.coordinates[0];
      }
      searchPoint.location.lat /= this.state.meetingUsers.length;
      searchPoint.location.lng /= this.state.meetingUsers.length;
    }

    axios({
      method: 'post',
      url: serverAPI.serverURL + serverAPI.serverVersion + 'findRoute/findLoc?token=' + this.props.match.params.token,
      data: {
        searchPoint: searchPoint
      }
    }).then((res) => {
      this.setState({
        showLoadingWindow : false
      });
      window.location = this.props.match.url;
    }).catch((err) => {
      console.log(err);
    });

    return ;
  };

  selectResult = (e) => {
    if (this.state.selectedResult == e.target.id) {
      this.setState({
        selectedResult: -1
      });
      return ;
    }

    this.setState({
      selectedResult: e.target.id
    });
  };

  selectResultMarker = (e) => {
    if (this.state.selectedResult == e) {
      this.setState({
        selectedResult: -1
      });
      return ;
    }

    this.setState({
      selectedResult: e
    });
  };

  vote = () => {
    if (this.state.voteArea == -1) {
      alert("투표지역을 선택해야 합니다!");
      return ;
    };

    axios({
      method: 'post',
      url: serverAPI.serverURL + serverAPI.serverVersion + 'voting/makeVoting?token=' + this.props.match.params.token,
      data: {
        index: this.state.voteArea
      }
    }).then((res) => {
      alert(this.state.resultAreas[this.state.voteArea].name + "에 투표하셨습니다");
      window.location = this.props.match.url;
    }).catch((err) => {
      console.log(err);
      alert("잘못된 경로입니다.");
      window.location = "/";
    });
  };

  selectVoteArea = (e) => {

    this.setState({
      voteArea: e.target.id
    });

  };

  render() {
    const { classes } = this.props;

    return (
      <div className="root">
       {this.showLoadingWindow()}
        <Table style={{height: "100%"}}>
          <TableBody height = '100%'>
              <TableRow>
                <td component="th" scope="row" className="info" id="side_area" onClick={this.footerMenuSlide} onTouchStart={this._onTouchStart} onTouchMove={this._onTouchMove} onTouchEnd={this._onTouchEnd} style={{fontFamily: "'Noto Sans KR', sans-serif"}}>
                <MenuIcon id="footer_menu_btn" />
                <div id="side_area_top">
                  <table class="app-bar">
                    <td>
                      <IconButton id="side_area_menu_btn"  color="inherit" aria-label="Menu">
                        <MenuIcon />
                      </IconButton>
                    </td>
                    <td>
                      <button class="btn-goback" onClick={() => {window.location = '/'}}>
                      <svg viewBox="-33 -141 1065.0001 1065" height="1.5em" xmlns="http://www.w3.org/2000/svg"><path d="m679.929688 141.726562h-440.1875v-150.5l-241.761719 241.773438 241.761719 241.761719v-155.546875h440.1875c76.644531 0 139.003906 62.359375 139.003906 139.003906 0 76.648438-62.359375 139-139.003906 139h-501.996094v177.488281h501.996094c174.511718 0 316.488281-141.972656 316.488281-316.488281s-141.976563-316.492188-316.488281-316.492188zm0 0"/></svg>
                        처음으로 돌아가기
                      </button>
                    </td>
                  </table>
                </div>
                <div class="top-bar">
                    <div class="top-bar-title">
                        {this.state.meeting.name}
                    </div>
                </div>
                <div class="share-box">
                    <button id="kakaoShareBtn" class="btn btn-share">친구들에게 공유</button>
                </div>
                {
                  this.state.meeting.result ?
                  (<div id="resultroom">
                      <ResultRoom resultAreas={this.state.resultAreas} meetingUsers={this.state.meetingUsers} selectedResult={this.state.selectedResult} selectResult={this.selectResult} vote={this.vote} voteArea={this.state.voteArea} selectVoteArea={this.selectVoteArea} />
                  </div>)
                  : (<div id="privateroom">
                    <PrivateRoom meeting={this.state.meeting} meetingUsers={this.state.meetingUsers} myMarker={this.state.myMarker} submit={this.submit} findLoc={this.findLoc} deleteUser={this.deleteUser} handleChange={this.handleChange} showResult={this.showResult}/>
                  </div>)
                }
                </td>
                <div id="map_area"><Map myMarker={this.state.myMarker} meetingUsers={this.state.meetingUsers} setMyMarker={this.setMyMarker} setMarker={this.setMarker} resultAreas={this.state.resultAreas} selectResultMarker={this.selectResultMarker} searchPoint={this.state.searchPoint} setSearchPoint={this.setSearchPoint} clickSearchButton={this.clickSearchButton}/></div>
              </TableRow>
          </TableBody>
        </Table>
      </div>
    )
  }
};

export default Meeting;
