import React, { Component } from 'react';
import './PrivateRoom.css';
import PropTypes from 'prop-types';

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
            <td>{this.props.meetingUsers[i].name}</td>
            <td>{this.props.meetingUsers[i].location.coordinates[0]}</td>
            <td>{this.props.meetingUsers[i].location.coordinates[1]}</td>
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
                        <div class="Wrapper">
                            <input type="text" id="user-name" class="Input-text" placeholder="이름을 알려주세요!"  onChange={this.props.handleChange}/>
                            <label for="room-name" class="Input-label">이름</label>
                        </div>
                    </tr>
                    <tr>
                        <div class="Wrapper">
                            <input type="text" id="room-name" class="Input-text" placeholder="읭 인풋이 아니지" />
                            <label for="room-name" class="Input-label">출발 위치</label>
                        </div>
                    </tr>
                    <tr>
                      latitude : <input type="text" size = '16' name="lat" id={0} value={this.props.myMarker.location.lat} onChange={this.props.handleChange} /><br></br>
                      longitude : <input type="text" size = '14' name="lng" id={0} value={this.props.myMarker.location.lng} onChange={this.props.handleChange} />
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
                <div class="show-other-people">
                    <table class="location-input-table">
                      {this.showOtherUsers()}
                        <tr>
                        </tr>
                        <tr>

                        </tr>
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
