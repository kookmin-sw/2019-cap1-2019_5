import React, { Component } from 'react';
import './ResultRoom.css';
import PropTypes from 'prop-types';
import Checkbox from '@material-ui/core/Checkbox';
import SubwayIcon from '../images/subway.png';

class ResultRoom extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          resultAreas: this.props.resultAreas,
          scrollHeight: window.innerHeight - 210
        }
    };

    componentWillReceiveProps(nextProps) {
      this.setState({ resultAreas: this.props.resultAreas });
    };

    convertToKm(input) {
      return (input/1000).toFixed(1);
    }

    result = () => {
      let candidates = [];

      for(let i =0; i < this.state.resultAreas.length; i++){
        candidates.push(
          <div class="candidates">
            <input id={i} type="checkbox" class="area-checkbox" name="candidates-open" checked={i == this.props.selectedResult ? true : false} onChange={this.props.selectResult} ></input>
              <label for={i} class="area-label"></label>
              <div class="area-title">
                  <div class="area-info">
                      <div class="chart-pie negative over50">
                          <span class="chart-pie-count">{this.props.resultAreas[i].vote} 표</span>
                      </div>
                      <span class="area-name">{this.state.resultAreas[i].name}</span>
                      <span class="votebox"><Checkbox id={i} checked={i == this.props.voteArea ? true : false} onChange={this.props.selectVoteArea} /></span>
                  </div>
              </div>
              <div class="area-path-details">
                  <div class="area-details-wrapper">
                      <div>
                          <div class="area-spec-header">
                              <span style={{fontWeight: "bold", fontSize: "1.1em"}}>평균소요시간: {this.state.resultAreas[i].average.avgDuration}분</span>
                              <span>평균거리: {this.convertToKm(this.state.resultAreas[i].average.avgDistance)}km</span>
                          </div>
                          <div>
                          <div class="area-spec-header">
                              {this.showUserRouteResult(i)}
                          </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
        )
      }
      return candidates;
    };

    showUserRouteResult(areaNum) {
      let userRouteBox = [];

      for (let i=0; i<this.state.resultAreas[areaNum].users.length; i++) {
        userRouteBox.push(
          <span>
            <hr class="area-spec-hr"></hr>
            <div class="area-spec-header">
              <h2 style={{color: "#535353"}}>{this.props.meetingUsers[i].name}</h2>
              <span>{"거리 : " + this.convertToKm(this.state.resultAreas[areaNum].users[i].distance)}km</span>
              <span>{"소요시간 : " + this.state.resultAreas[areaNum].users[i].duration}분</span>
            </div>
          </span>
        )

        for (let j =0; j<this.state.resultAreas[areaNum].users[i].route.length; j++) {
          userRouteBox.push(
            <div>
              <table width="100%">
                <tr>
                <td style={{verticalAlign: "middle", paddingRight: "15px", width: "13px"}}>{(j+1)}</td>
                <td style={{position:"relative", width: "1px"}}>
                  <div style={{height: "100%", marginRight: "2px"}}>
                  <div class="vertical-hr"></div>
                  </div>
                </td>
                <td>
                  {(this.showTransportationIcon(this.state.resultAreas[areaNum].users[i].route[j]))}
                </td>
                </tr>
              </table>
            </div>
          )
        }
      }

      return userRouteBox;
    };

    showTransportationIcon(trans){
      if (trans.transportation == "driving"){
        return (
          <div className="showTransportationDiv">
            <table width="100%">
              <td style={{paddingRight: "0px", textAlign: "center", width: "25%", verticalAlign: "middle"}}>
                {this.carIcon()}
              </td>
              <td style={{verticalAlign: "middle"}}>
                {trans.name}
              </td>
            </table>
          </div>
        );
      } else if (trans.transportation == "bus") {
        return (
          <div className="showTransportationDiv" >
            <table width="100%">
              <td style={{paddingRight: "2px", textAlign: "center", width: "25%", verticalAlign: "middle"}}>
                {this.busIcon()}
                <br></br>
                {trans.lineNum}
              </td>
              <td style={{verticalAlign: "middle"}}>
                {trans.startName}
                {" → "}
                {trans.endName}
              </td>
            </table>
          </div>
        );
      } else if (trans.transportation == "subway") {
        return (
          <div class="showTransportationDiv">
            <table width="100%">
              <td style={{paddingRight: "2px", textAlign: "center", width: "25%", verticalAlign: "middle"}}>
                <img src={SubwayIcon} style= {{height: "1.5em"}}/>
                <br></br>
                {trans.lineNum}
              </td>
              <td style={{verticalAlign: "middle"}}>
                {trans.startName}
                {" → "}
                {trans.endName}
              </td>
            </table>
          </div>
        );
      } else {
        return (
          <div class="showTransportationDiv">
            <table width="25%"><td style={{textAlign: "center"}}>
            {this.walkIcon()}
            </td></table>
          </div>
        )
      }
    };

    carIcon() {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 459 459" style={{height: "1.5em"}}>
        <path d="M405.45,51c-5.101-15.3-20.4-25.5-35.7-25.5H89.25c-17.85,0-30.6,10.2-35.7,25.5L0,204v204c0,15.3,10.2,25.5,25.5,25.5H51 c15.3,0,25.5-10.2,25.5-25.5v-25.5h306V408c0,15.3,10.2,25.5,25.5,25.5h25.5c15.3,0,25.5-10.2,25.5-25.5V204L405.45,51z M89.25,306C68.85,306,51,288.15,51,267.75s17.85-38.25,38.25-38.25s38.25,17.85,38.25,38.25S109.65,306,89.25,306z M369.75,306 c-20.4,0-38.25-17.85-38.25-38.25s17.85-38.25,38.25-38.25S408,247.35,408,267.75S390.15,306,369.75,306z M51,178.5L89.25,63.75 h280.5L408,178.5H51z"/>
      </svg>
      )
    }

    busIcon() {
      return (
        <svg  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 484.5 484.5" style={{height: "1.5em"}}>
          <path d="M38.25,357c0,22.95,10.2,43.35,25.5,56.1V459c0,15.3,10.2,25.5,25.5,25.5h25.5c15.3,0,25.5-10.2,25.5-25.5v-25.5h204V459 c0,15.3,10.2,25.5,25.5,25.5h25.5c15.3,0,25.5-10.2,25.5-25.5v-45.9c15.3-12.75,25.5-33.149,25.5-56.1V102 c0-89.25-91.8-102-204-102s-204,12.75-204,102V357z M127.5,382.5c-20.4,0-38.25-17.85-38.25-38.25S107.1,306,127.5,306 s38.25,17.85,38.25,38.25S147.9,382.5,127.5,382.5z M357,382.5c-20.4,0-38.25-17.85-38.25-38.25S336.6,306,357,306 s38.25,17.85,38.25,38.25S377.4,382.5,357,382.5z M395.25,229.5h-306V102h306V229.5z"/>
        </svg>
      )
    }

    walkIcon() {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style={{height: "2em", position: "relative" ,top: "2px"}}>
          <path d="M13.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM9.8 8.9L7 23h2.1l1.8-8 2.1 2v6h2v-7.5l-2.1-2 .6-3C14.8 12 16.8 13 19 13v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1L6 8.3V13h2V9.6l1.8-.7"></path>
        </svg>
      )
    }

    getScrollHeight() {
      return {
        height: this.state.scrollHeight
      }
    }

    render() {
        const { classes } = this.props;

        window.onresize = () => {
          this.setState({ scrollHeight: window.innerHeight - 210 });
        }

        return (
          <div>
            <div class="share-box">
                <button class="btn btn-share" onClick={this.props.vote} >투표 제출</button>
            </div>
            <div class="set-scroll" style={this.getScrollHeight()}>
                <div class="candidates-window">
                    {this.result()}
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
