import React, { Component } from 'react';
import './PrivateRoom.css';
import PropTypes from 'prop-types';

class PrivateRoom extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        const { classes } = this.props;
        return (
            <div>
                <div class="top-bar">
                    <div class="top-bar-title">
                        ㅁㄷㅁㅇ
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
