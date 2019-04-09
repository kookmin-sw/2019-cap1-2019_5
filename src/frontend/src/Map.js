import React from "react"
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"
const { MarkerClusterer } = require("react-google-maps/lib/components/addons/MarkerClusterer");

const CustomMap = withScriptjs(withGoogleMap(props =>
  <div>
  <GoogleMap defaultZoom={8} defaultCenter={{ lat: -34.397, lng: 150.644 }}>
    <Marker position={{ lat: -34.397, lng: 150.644 }} />
  </GoogleMap>
  </div>
));

class App extends React.PureComponent {
  state = {
    isMarkerShown: true,
    markers: []
  }
  componentDidMount() {
  }


  handleMarkerClick = () => {
    this.setState({ isMarkerShown: false })
  }

  render() {
    return (
      <div>
        <div>lat: {}</div>
        <div>lng: {}</div>
        <CustomMap
          isMarkerShown={this.state.isMarkerShown}
          onMarkerClick={this.handleMarkerClick}
          onMarkerClustererClick={this.onMarkerClustererClick}
          markers= {this.state.markers}
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

export default App;
