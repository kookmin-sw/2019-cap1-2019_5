import React, { Component } from 'react';
import './ResultRoom.css';
import PropTypes from 'prop-types';
import { withStyles, Icon, IconButton,
         ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails,
         Typography, Paper, Divider} from '@material-ui/core/';
import DirectionsBus from '@material-ui/icons/DirectionsBus';
import DirectionsCar from '@material-ui/icons/DirectionsCar';
import DirectionsSubway from '@material-ui/icons/DirectionsSubway';
import DirectionsWalk from '@material-ui/icons/DirectionsWalk';

class ResultRoom extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          resultAreas: this.props.resultAreas
        }
    };

    componentWillReceiveProps(nextProps) {
      this.setState({ resultAreas: this.props.resultAreas });
    };

    result = () => {
      let candidates = [];
      console.log("??", this.state.resultAreas.length);

      for(let i =0; i < this.state.resultAreas.length; i++){
        candidates.push(
          <div class="candidates ">
              <input id={i} i type="checkbox" class="area-checkbox" name="candidates-open"/>
              <label for={i} class="area-label"></label>
              <div class="area-title">
                  <div class="area-info">
                      <div class="chart-pie negative over50">
                          <span class="chart-pie-count">1</span>
                      </div>
                      <span class="area-name">{this.state.resultAreas[i].name}</span>
                  </div>
              </div>
              <div class="area-path-details">
                  <div class="area-details-wrapper">
                      <div>
                          <div class="area-spec-header">
                              <span>평균소요시간: {this.state.resultAreas[i].average.avgDuration}</span>
                              <span>평균거리: {this.state.resultAreas[i].average.avgDistance}</span>
                          </div>
                          <hr class="area-spec-hr"></hr>
                          <div class="area-spec-header">
                              <span>{this.showUserRouteResult(i)}</span>
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
          <div>
            <h2>{(i+1) + "번째 유저"}</h2>
            <div>{"소요시간 : " + this.state.resultAreas[areaNum].users[i].duration}</div>
            <div>{"거리 : " + this.state.resultAreas[areaNum].users[i].distance}</div>
          </div>
        )

        for (let j =0; j<this.state.resultAreas[areaNum].users[i].route.length; j++) {
          userRouteBox.push(
            <div>
              <table>
                <td>{(j+1) + ". "}</td>
                <td>{(this.showTransportationIcon(this.state.resultAreas[areaNum].users[i].route[j]))}</td>
              </table>
            </div>
          )
        }
        userRouteBox.push(
          <br></br>
        )
      }

      return userRouteBox;
    };

    showTransportationIcon(trans){
      if (trans.transportation == "driving"){
        return (
          <div>
            <Icon><DirectionsCar /></Icon>
            {trans.name}
          </div>
        );
      } else if (trans.transportation == "bus") {
        return (
          <div>
            {" ( "}
            <Icon><DirectionsBus /></Icon>
            {" "}
            {trans.lineNum}
            {" ) "}
            {trans.startName}
            {" -> "}
            {trans.endName}
          </div>
        );
      } else if (trans.transportation == "subway") {
        return (
          <div>
            {" ( "}
            <Icon><DirectionsSubway /></Icon>
            {" "}
            {trans.lineNum}
            {" ) "}
            {trans.startName}
            {" -> "}
            {trans.endName}
          </div>
        );
      } else {
        return (
          <div>
            <Icon><DirectionsWalk /></Icon>
          </div>
        )
      }
    };

    render() {
        const { classes } = this.props;
        return (
            <div class="set-font">
                <div class="candidates-window">
                    {this.result()}

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
