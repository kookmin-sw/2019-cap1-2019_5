import React, { Component } from 'react';
import './PrivateRoom.css';
import PropTypes from 'prop-types';
import car from '../images/car.png';
import metro from '../images/metro.png';

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
                    <button class="btn btn-share" onClick={() => this }>친구들에게 공유</button>
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
                            <div id="start-position" class="Start-position">
                                서울특별시
                            </div>
                            <label for="start-position" class="Input-label">출발 위치</label>
                        </div>
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
