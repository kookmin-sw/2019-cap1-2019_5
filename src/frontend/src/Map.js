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

    if (this.props.showResult != true){
      for (let i = 0; i< this.props.markers.length; i++) {
        visibleMarkers.push(
          <Marker position={{ lat: this.props.markers[i].location.lat, lng: this.props.markers[i].location.lng }} draggable={this.props.selectedMarker == i ? true : false} onClick={this.onMarkerChange} onDragEnd={this.onMarkerChange} label={(i+1).toString()} />
        )
      }
    } else {
      for (let i = 0; i< this.props.markers.length; i++) {
        visibleMarkers.push(
          <Marker position={{ lat: this.props.markers[i].location.coordinates[1], lng: this.props.markers[i].location.coordinates[0] }} draggable={false} onClick={() => alert(this.props.markers[i].name) } label={this.props.markers[i].name} />
        )
      }
    }

    return visibleMarkers;
  }

  CustomMap = withScriptjs(withGoogleMap((props) => {
    return (<GoogleMap defaultZoom={12} defaultCenter={{ lat: 37.5665, lng: 126.9780 }} onClick={this.onMapClick}>
      {this.showMarkers()}
    </GoogleMap>)
  }));

  render() {

    const {CustomMap} = this;

    return (
      <div>
        <CustomMap
          isMarkerShown={this.state.isMarkerShown}
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
