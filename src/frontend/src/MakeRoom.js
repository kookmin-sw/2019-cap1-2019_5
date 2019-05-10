import React, { Component } from 'react';
import './MakeRoom.css';
import PropTypes from 'prop-types';
import logo from './images/logo.png'

class MakeRoom extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        const { classes } = this.props;
        return (
            <div style={{display:"table", width:"100%", height:"100vh", textAlign: "center"}}>
            <div style={{display:"table-cell", verticalAlign:"middle"}}>
            <img src={logo} alt="MDMY" height="150px" width="150px"/>
                <table width='400' class="makeroom-table">
                    <tr height="25px">
                    </tr>
                    <tr class="makeroom-insert-box">
                    <div class="Wrapper">
                        <input type="text" id="room-name" class="Input-text" placeholder="방이름을 입력해주세요." />
                        <label for="room-name" class="Input-label">방이름</label>
                    </div>
                    </tr>
                    <tr class="makeRoom-insert-box">
                    <div class="Wrapper">
                        <input type="text" id="number-of-people" class="Input-text" placeholder="예) 6" />
                        <label for="number-of-people" class="Input-label">인원수</label>
                    </div>
                    </tr>
                    <tr style={{textAlign: "center"}}>
                        <div class="btn-box">
                            <button class="btn btn-link" onClick={() => this }>방만들기</button>
                        </div>
                    <br></br>
                    </tr>
                </table>
            </div>
            </div>
        )
    }
};

MakeRoom.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default MakeRoom;
