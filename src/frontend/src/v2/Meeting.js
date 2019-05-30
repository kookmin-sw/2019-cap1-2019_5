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
          name: "지도에서 위치를 검색 혹은 클릭!"
        },
        transportation: "public",
        name: ""
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
          container: '#kakaoShareBtn1',
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

    if (this.state.myMarker.name == "") {
      alert("이름을 입력해주세요.")
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
        locName: this.state.resultAreas[this.state.voteArea].name
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

  deleteUser = (e) => {

    axios({
      method: 'post',
      url: serverAPI.serverURL + serverAPI.serverVersion + 'meeting/deleteUser/?token=' + this.props.match.params.token,
      data: {
        user: this.state.meetingUsers[e.target.id]._id
      }
    }).then((res) => {
      window.location = this.props.match.url;
    }).catch((err) => {
      console.log(err);
      alert("잘못된 요청입니다.");
      window.location = "/";
    });
  };

  sortingResult = (e) => {
    let newResult = clone(this.state.resultAreas);

    if (e.target.id == "추천순") {
      newResult.sort(function sortBydurationStdDeviation(candidate1, candidate2) {
        if (candidate1.average.durationStdDeviation == candidate2.average.durationStdDeviation) {
          return 0;
        } else {
          return candidate1.average.durationStdDeviation > candidate2.average.durationStdDeviation ? 1 : -1;
        }
      });
    } else if (e.target.id == "별점순") {
      newResult.sort(function sortByRating(candidate1, candidate2) {
        if (candidate1.rating == candidate2.rating) {
          return 0;
        } else {
          return candidate1.rating > candidate2.rating ? -1 : 1;
        }
      });
    } else if (e.target.id == "투표순") {
      newResult.sort(function sortByVotes(candidate1, candidate2) {
        if (candidate1.vote == candidate2.vote) {
          return 0;
        } else {
          return candidate1.vote > candidate2.vote ? -1 : 1;
        }
      });
    }

    this.setState({
      resultAreas: newResult,
      selectedResult: -1
    })

  };

  render() {
    const { classes } = this.props;

    return (
      <div className="root">
       {this.showLoadingWindow()}
       <div id="kakaoShareBtn1" class="forKakao"><svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 256 256"><path fill="#FFE812" d="M256 236c0 11.046-8.954 20-20 20H20c-11.046 0-20-8.954-20-20V20C0 8.954 8.954 0 20 0h216c11.046 0 20 8.954 20 20v216z"/><path fill="#3c1e20" d="M128 36C70.562 36 24 72.713 24 118c0 29.279 19.466 54.97 48.748 69.477-1.593 5.494-10.237 35.344-10.581 37.689 0 0-.207 1.762.934 2.434s2.483.15 2.483.15c3.272-.457 37.943-24.811 43.944-29.04 5.995.849 12.168 1.29 18.472 1.29 57.438 0 104-36.712 104-82 0-45.287-46.562-82-104-82z"/><path fill="#FFE812" d="M70.5 146.625c-3.309 0-6-2.57-6-5.73V105.25h-9.362c-3.247 0-5.888-2.636-5.888-5.875s2.642-5.875 5.888-5.875h30.724c3.247 0 5.888 2.636 5.888 5.875s-2.642 5.875-5.888 5.875H76.5v35.645c0 3.16-2.691 5.73-6 5.73zM123.112 146.547c-2.502 0-4.416-1.016-4.993-2.65l-2.971-7.778-18.296-.001-2.973 7.783c-.575 1.631-2.488 2.646-4.99 2.646a9.155 9.155 0 0 1-3.814-.828c-1.654-.763-3.244-2.861-1.422-8.52l14.352-37.776c1.011-2.873 4.082-5.833 7.99-5.922 3.919.088 6.99 3.049 8.003 5.928l14.346 37.759c1.826 5.672.236 7.771-1.418 8.532a9.176 9.176 0 0 1-3.814.827c-.001 0 0 0 0 0zm-11.119-21.056L106 108.466l-5.993 17.025h11.986zM138 145.75c-3.171 0-5.75-2.468-5.75-5.5V99.5c0-3.309 2.748-6 6.125-6s6.125 2.691 6.125 6v35.25h12.75c3.171 0 5.75 2.468 5.75 5.5s-2.579 5.5-5.75 5.5H138zM171.334 146.547c-3.309 0-6-2.691-6-6V99.5c0-3.309 2.691-6 6-6s6 2.691 6 6v12.896l16.74-16.74c.861-.861 2.044-1.335 3.328-1.335 1.498 0 3.002.646 4.129 1.772 1.051 1.05 1.678 2.401 1.764 3.804.087 1.415-.384 2.712-1.324 3.653l-13.673 13.671 14.769 19.566a5.951 5.951 0 0 1 1.152 4.445 5.956 5.956 0 0 1-2.328 3.957 5.94 5.94 0 0 1-3.609 1.211 5.953 5.953 0 0 1-4.793-2.385l-14.071-18.644-2.082 2.082v13.091a6.01 6.01 0 0 1-6.002 6.003z"/></svg></div>

        <Table style={{height: "100%"}}>
          <TableBody height = '100%'>
              <TableRow>
                <td component="th" scope="row" className="info" id="side_area" style={{fontFamily: "'Noto Sans KR', sans-serif"}}>

                <div id="side_area_hamberger" onClick={this.footerMenuSlide} onTouchStart={this._onTouchStart} onTouchMove={this._onTouchMove} onTouchEnd={this._onTouchEnd}>
                <MenuIcon id="footer_menu_btn" />
                </div>
                <div>
                <div id="side_area_top">
                  <table class="app-bar">
                    <td>
                    <button class="btn-goback" onClick={() => {window.location = '/'}}>
                      <td>
                      <svg viewBox="-33 -141 1065.0001 1065" height="1.5em" xmlns="http://www.w3.org/2000/svg"><path d="m679.929688 141.726562h-440.1875v-150.5l-241.761719 241.773438 241.761719 241.761719v-155.546875h440.1875c76.644531 0 139.003906 62.359375 139.003906 139.003906 0 76.648438-62.359375 139-139.003906 139h-501.996094v177.488281h501.996094c174.511718 0 316.488281-141.972656 316.488281-316.488281s-141.976563-316.492188-316.488281-316.492188zm0 0"/></svg>
                      </td>
                      <td>HOME</td>
                    </button>
                    </td>
                    <td>
                    {this.state.meeting.name}
                    </td>
                  </table>
                </div>
                <div style={{textAlign: "center"}}>
                  
                  </div>
                {
                  this.state.meeting.result ?
                  (<div id="resultroom">
                      <ResultRoom resultAreas={this.state.resultAreas} meetingUsers={this.state.meetingUsers} selectedResult={this.state.selectedResult} selectResult={this.selectResult} vote={this.vote} voteArea={this.state.voteArea} selectVoteArea={this.selectVoteArea} sortingResult={this.sortingResult} />
                  </div>)
                  : (<div id="privateroom">
                    <PrivateRoom meeting={this.state.meeting} meetingUsers={this.state.meetingUsers} myMarker={this.state.myMarker} submit={this.submit} findLoc={this.findLoc} deleteUser={this.deleteUser} handleChange={this.handleChange} showResult={this.showResult} deleteUser={this.deleteUser}/>
                  </div>)
                }
                </div>
                </td>
                <div id="map_area"><Map myMarker={this.state.myMarker} meetingUsers={this.state.meetingUsers} setMyMarker={this.setMyMarker} setMarker={this.setMarker} resultAreas={this.state.resultAreas} selectResultMarker={this.selectResultMarker} searchPoint={this.state.searchPoint} setSearchPoint={this.setSearchPoint} clickSearchButton={this.clickSearchButton} meeting={this.state.meeting}/></div>
              </TableRow>
          </TableBody>
        </Table>
      </div>
    )
  }
};

export default Meeting;
