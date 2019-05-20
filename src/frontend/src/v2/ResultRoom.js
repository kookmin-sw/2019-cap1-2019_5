import React, { Component } from 'react';
import './ResultRoom.css';
import PropTypes from 'prop-types';

class ResultRoom extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        const { classes } = this.props;
        return (
            <div class="set-font">
                <div class="top-bar">
                    <div class="top-bar-title">
                        ㅁㄷㅁㅇ
                    </div>
                </div>
                <div class="share-box">
                    <button class="btn btn-share" onClick={() => this }>친구들에게 공유</button>
                </div>
                <div class="candidates-window">
                    <div class="candidates ">
                        <input id="candidate" type="checkbox" class="area-checkbox" name="candidates-open"/>
                        <label for="candidate" class="area-label"></label>
                        <div class="area-title">
                            <div class="area-info">
                                <div class="chart-pie negative over50">
                                    <span class="chart-pie-count">1</span>
                                </div>
                                <span class="area-name">강남</span>
                            </div>
                        </div>
                        <div class="area-path-details">
                            <div class="area-details-wrapper">
                                <div>
                                    <div class="area-spec-header">
                                        <span>소요시간: 4분</span>
                                    </div>
                                    <hr class="area-spec-hr"></hr>
                                    <div class="area-spec-header">
                                        <span>OOO님의 이동경로</span>
                                    </div>
                                    <div class="area-path">
                                        <span >앉아서 북악중학교까지 이동 후 뒤로취침으로 정릉까지 가세요.</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="candidates ">
                        <input id="candidat" type="checkbox" class="area-checkbox" name="candidates-open"/>
                        <label for="candidat" class="area-label"></label>
                        <div class="area-title">
                            <div class="area-info">
                                <div class="chart-pie negative over50">
                                    <span class="chart-pie-count">1</span>
                                </div>
                                <span class="area-name">강남</span>
                            </div>
                        </div>
                        <div class="area-path-details">
                            <div class="area-details-wrapper">
                                <div>
                                    <div class="area-spec-header">
                                        <span>소요시간: 4분</span>
                                    </div>
                                    <hr class="area-spec-hr"></hr>
                                    <div class="area-spec-header">
                                        <span>OOO님의 이동경로</span>
                                    </div>
                                    <div class="area-path">
                                        <span >앉아서 북악중학교까지 이동 후 뒤로취침으로 정릉까지 가세요.</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        )
    }
};

ResultRoom.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default ResultRoom;