import React from "react"
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"

class Map extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isMarkerShown: true
    }
  }

  onMapClick = (event) => {
    this.props.setMarker({
      lat: event.latLng.lat(),
      lng: event.latLng.lng()
    });
  }

  onMarkerChange = (event) => {
    this.props.setMarker({
      lat: event.latLng.lat(),
      lng: event.latLng.lng()
    });
  };

  showMarkers() {
    let visibleMarkers = [];

    for (let i = 0; i< this.props.users.length; i++) {
      visibleMarkers.push(
        <Marker position={{ lat: this.props.users[i].location.lat, lng: this.props.users[i].location.lng }} draggable={this.props.selectedMarker == i ? true : false} onClick={this.onMarkerChange} onDragEnd={this.onMarkerChange} />
      )
    }

    return visibleMarkers;
  }

  CustomMap = withScriptjs(withGoogleMap((props) => {
    return (<GoogleMap defaultZoom={10} defaultCenter={{ lat: 37.5665, lng: 126.9780 }} onClick={this.onMapClick}>
      {this.showMarkers()}
    </GoogleMap>)
  }));

  render() {

    const {CustomMap} = this;

    return (
      <div>
        <CustomMap
          isMarkerShown={this.state.isMarkerShown}
          onMarkerClick={() => {alert("Click!")}}
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
