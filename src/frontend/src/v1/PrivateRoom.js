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
                    <button id="kakaoShareBtn" class="btn btn-share">친구들에게 공유</button>
                </div>
                <table class="location-input-table">
                    <tr>
                        <div class="Wrapper">
                            <input type="text" id="room-name" class="Input-text" placeholder="이름을 알려주세요!" />
                            <label for="room-name" class="Input-label">이름</label>
                        </div>
                    </tr>
                    <tr>
                        <div class="Wrapper">
                            <input type="text" id="room-name" class="Input-text" placeholder="읭 인풋이 아니지" />
                            <label for="room-name" class="Input-label">출발 위치</label>
                        </div>
                    </tr>
                </table>
                <table class="search-table">
                    <td>
                        <button  class="btn btn-submit" onClick={() => this }>이름과 출발위치 제출</button>
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
