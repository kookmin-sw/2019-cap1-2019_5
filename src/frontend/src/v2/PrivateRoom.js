import React, { Component } from 'react';
import './PrivateRoom.css';
import PropTypes from 'prop-types';
import car from '../images/car.png';
import metro from '../images/metro.png';
import Checkbox from '@material-ui/core/Checkbox';

class PrivateRoom extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    showOtherUsers() {
      let usersBox = [];
      console.log(this.props.meetingUsers);
      for (let i=0; i < this.props.meetingUsers.length; i++) {
        usersBox.push(
          <tr>
            <td>
              <div><p>이름</p> <p>{this.props.meetingUsers[i].name}</p></div>
              <div><p>Latitude</p> <p>{this.props.meetingUsers[i].location.coordinates[0]}</p></div>
              <div><p>Longitude</p> <p>{this.props.meetingUsers[i].location.coordinates[1]}</p></div>
            </td>
          </tr>
        )
      }
      return usersBox;
    };

    componentDidMount(){
        window.Kakao.Link.createDefaultButton({
          container: '#kakaoShareBtn',
          objectType: 'feed',
          content: {
            title: 'MDMY', //카카오톡 공유 제목영역
            description: '모임방 링크', //카카오톡 공유 내용영역
            imageUrl: '', //공유 이미지
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
      }

    render() {
        const { classes } = this.props;
        return (
            <div>
                <div class="top-bar">
                    <div class="top-bar-title">
                        {this.props.meeting.name}
                    </div>
                </div>
                <div class="share-box">
                    <button id="kakaoShareBtn" class="btn btn-share">친구들에게 공유</button>
                </div>
                <table class="location-input-table">
                    <tr>
                      <td>
                        <div class="Wrapper">
                            <input type="text" id="user-name" name="name" class="Input-text" placeholder="이름을 알려주세요!"  onChange={this.props.handleChange}/>
                            <label for="room-name" class="Input-label">이름</label>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>
                          <div class="Wrapper">
                              <div id="start-position" class="Start-position">
                                  서울특별시
                              </div>
                              <label for="start-position" class="Input-label">출발 위치</label>
                          </div>
                      </td>
                    </tr>
                    <tr>
                        <div>
                            <img src={car} alt="car" className="TransfortationImage"/>
                            <input class='toggle' id='cb1' type='checkbox'/>
                            <label class='toggle-button' for='cb1'></label>
                            <label for='cb1'>
                            </label>
                            <img src={metro} alt="metro" className="TransfortationImage"/>
                        </div>
                    </tr>
                </table>
                <table class="search-table">
                    <td>
                        <button  class="btn btn-submit" onClick={() => this } onClick={() => {this.props.submit()}}>이름과 출발위치 제출</button>
                    </td>
                    <td width="20"></td>
                    <td>
                        <button class="btn btn-result" onClick={() => this }>결과 보기</button>
                    </td>
                </table>
                <div class="show-other-people" id="submit-list">
                    <table class="location-input-table">
                      {this.showOtherUsers()}
                    </table>
                </div>
            </div>
        )
    }
};

PrivateRoom.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default PrivateRoom;
