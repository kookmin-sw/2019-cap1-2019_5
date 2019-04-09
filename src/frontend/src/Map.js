import React from "react"
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"

class Map extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isMarkerShown: true,
      markers: []
    }
  }

  onMapClick = (event) => {
    let newMarkers = this.state.markers.concat({
      lat: event.latLng.lat(),
      lng: event.latLng.lng()
    });

    this.setState({
      markers: newMarkers
    });
  }

  showMarkers() {
    let output = [];

    for (let i = 0; i< this.state.markers.length; i++) {
      output.push(
        <Marker position={{ lat: this.state.markers[i].lat, lng: this.state.markers[i].lng }} draggable={true} onClick={this.onMarkerClick} />
      )
    }

    return output;
  }

  CustomMap = withScriptjs(withGoogleMap((props) => {
    return (<GoogleMap defaultZoom={8} defaultCenter={{ lat: -34.397, lng: 150.644 }} onClick={this.onMapClick}>
      {this.showMarkers()}
    </GoogleMap>)
  }));

  render() {

    const {CustomMap} = this;

    return (
      <div>
        <CustomMap
          isMarkerShown={this.state.isMarkerShown}
          onMarkerClick={this.handleMarkerClick}
          googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyC-wh2GZ92W7jsNjtHD1JUDoMl1nNLRJgo&v=3.exp&libraries=geometry,drawing,places"
          loadingElement={<div style={{ height: `100%` }} />}
          containerElement={<div style={{ height: `100vh` }} />}
          mapElement={<div style={{ height: `100%` }} />}
        >
        </CustomMap >
      </div>
    )
  }
}

export default Map;
