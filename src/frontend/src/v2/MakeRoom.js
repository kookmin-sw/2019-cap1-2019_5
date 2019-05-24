import React, { Component } from 'react';
import './MakeRoom.css';
import PropTypes from 'prop-types';
import logo from '../images/logo.png';
import axios from 'axios';
import { Redirect } from 'react-router-dom';

class MakeRoom extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          createMeeting: false,
          meetingToken: "",
          onlynumber: ''
        }
        this.handlePositiveInteger = this.handlePositiveInteger.bind(this)
    }

    makeMeeting = () => {
      let api = 'http://localhost:80/api/v2/meeting/makeMeeting';

      axios({
        method: 'post',
        url: api,
        data: {
          name: this.state.name,
          num: this.state.num
        }
      }).then((res) => {
        console.log(res);
        this.setState({
          createMeeting: true,
          meetingToken: res.data.token
        });
      }).catch((err) => {
        console.log(err);
        alert("알 수 없는 에러가 발생했습니다");
      });

    };

    handleChange = (e) => {
      if (e.target.id == "room-name") {
        this.setState({
          name: e.target.value
        })
      } else if (e.target.id == "number-of-people") {
        this.setState({
          num: e.target.value
        })
      }

      return ;
    };

    handlePositiveInteger(e){
      const re = /^[0-9\b]+$/;
      if (e.target.value === '' || re.test(e.target.value)) {
        this.setState({ onlynumber: e.target.value})
      }
      if (e.target.value < 1) {
        alert("1이상의 정수를 입력해주세요");
        this.setState({ onlynumber: ""})
      }

      this.setState({
        num: e.target.value
      })
    }

    render() {
        const { classes } = this.props;

        if (this.state.createMeeting) {
          return (<Redirect to={'/meeting/' + this.state.meetingToken} />);
        }

        return (
            <div style={{display:"table", width:"100%", height:"100vh", textAlign: "center"}}>
            <div style={{display:"table-cell", verticalAlign:"middle"}}>
            <img src={logo} alt="MDMY" height="150px" width="150px"/>
                <table width='400' id="makeroom-Table" class="makeroom-table">
                    <tr height="25px">
                    </tr>
                    <tr class="makeroom-insert-box">
                    <div class="Wrapper">
                        <input type="text" id="room-name" class="Input-text" placeholder="방이름을 입력해주세요." onChange={this.handleChange}/>
                        <label for="room-name" class="Input-label">방이름</label>
                    </div>
                    </tr>
                    <tr class="makeRoom-insert-box">
                    <div class="Wrapper">
                        <input type="text" id="number-of-people" class="Input-text" placeholder="예) 6" value={this.state.onlynumber} onChange={this.handlePositiveInteger}/>
                        <label for="number-of-people" class="Input-label">인원수</label>
                    </div>
                    </tr>
                    <tr style={{textAlign: "center"}}>
                        <div class="btn-box">
                            <button class="btn btn-link" onClick={this.makeMeeting}>방만들기</button>
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
