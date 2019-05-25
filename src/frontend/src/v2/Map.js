import React from "react"
import { withScriptjs, withGoogleMap, GoogleMap, Marker, InfoWindow } from "react-google-maps"
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import GpsFixedIcon from '@material-ui/icons/GpsFixed';
const { SearchBox } = require("react-google-maps/lib/components/places/SearchBox");
const myMarkerIcon = {
  url: require('../images/marker_red.png'),
  scaledSize: {width: 35, height:42}
};
const otherMarkerIcon = {
  url: require('../images/marker_orange.png'),
  scaledSize: {width: 25, height:35}
};
const resultMarkerIcon = {
  url: require('../images/marker_blue.png'),
  scaledSize: {width: 25, height:35}
};


const defaultMapOptions = {
  fullscreenControl: true,
  mapTypeControl: true,
  zoomControl: true,
  streetViewControl: true
};

class Map extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isMarkerShown: true
    }
  }

  componentWillMount() {
    const refs = {};

    this.setState({
      bounds: null,
      center: {
        lat: 37.5665,
        lng: 126.9780
      },
      markers: [],
      onMapMounted: ref => {
        refs.map = ref;
      },
      onBoundsChanged: () => {
        this.setState({
          bounds: refs.map.getBounds(),
          center: refs.map.getCenter(),
        })
      },
      onSearchBoxMounted: ref => {
        refs.searchBox = ref;
      },
      onPlacesChanged: () => {
        const places = refs.searchBox.getPlaces();
        const bounds = new window.google.maps.LatLngBounds();
        places.forEach(place => {
          if (place.geometry.viewport) {
            bounds.union(place.geometry.viewport)
          } else {
            bounds.extend(place.geometry.location)
          }
        });

        const nextMarkers = places.map(place => ({
          position: place.geometry.location,
        }));

        let nextCenter = places[0].geometry.location;

        this.setState({
          center: nextCenter,
          markers: nextMarkers,
        });

        this.props.setMyMarker({
          lat: places[0].geometry.location.lat(),
          lng: places[0].geometry.location.lng(),
          where: places[0].name
        });
      },
    })
  }

  onMapClick = (event) => {
    if (this.props.resultAreas.length != 0) {
      return ;
    };

    let geocoder = new window.google.maps.Geocoder();

    geocoder.geocode({'location': {lat: event.latLng.lat(), lng: event.latLng.lng()}}, (results, status) => {
      if (status == 'OK') {
        this.props.setMyMarker({
          lat: event.latLng.lat(),
          lng: event.latLng.lng(),
          where: results[0].formatted_address
        });
      } else {
        console.log('Geocode was not successful for the following reason: ' + status);
      }
    });

  };

  onMarkerChange = (event) => {
    this.props.setMyMarker({
      lat: event.latLng.lat(),
      lng: event.latLng.lng()
    });
  };

  showMarkers() {
    let visibleMarkers = [];

    visibleMarkers.push(
      <Marker position={{ lat: this.props.myMarker.location.lat, lng: this.props.myMarker.location.lng }} draggable={true} onClick={() => alert(this.props.MyMarker)} icon={myMarkerIcon}>
      </Marker>
    )

    for (let i=0; i < this.props.meetingUsers.length; i++) {
      visibleMarkers.push(
        <Marker position={{ lat: this.props.meetingUsers[i].location.coordinates[1], lng: this.props.meetingUsers[i].location.coordinates[0] }} draggable={false} icon={otherMarkerIcon}>
          <InfoWindow>
            <div>
              {this.props.meetingUsers[i].name}
            </div>
          </InfoWindow>
        </Marker>
      )
    }

    for (let i=0; i < this.props.resultAreas.length; i++) {
      visibleMarkers.push(
        <Marker position={{ lat: this.props.resultAreas[i].location.coordinates[1], lng: this.props.resultAreas[i].location.coordinates[0] }} draggable={false} icon={resultMarkerIcon} onClick={() => {this.props.selectResultMarker(i)}} >
          <InfoWindow>
            <div>
              {this.props.resultAreas[i].name}
            </div>
          </InfoWindow>
        </Marker>
      )
    }

    return visibleMarkers;
  }

  CustomMap = withScriptjs(withGoogleMap((props) => {
    return (
      <GoogleMap defaultZoom={13} defaultCenter={{ lat: 37.5665, lng: 126.9780 }} onClick={this.onMapClick} ref={this.state.onMapMounted} onBoundsChanged={props.onBoundsChanged} center={this.state.center} defaultOptions={defaultMapOptions}>
      {this.showMarkers()}

        <SearchBox
          ref={this.state.onSearchBoxMounted}
          bounds={this.state.bounds}
          controlPosition={window.google.maps.ControlPosition.TOP}
          onPlacesChanged={this.state.onPlacesChanged}
        >
        <div id="m_side_area_top">
          <IconButton id="m_side_area_menu_btn" color="inherit" aria-label="Menu">
            <MenuIcon />
          </IconButton>
          <IconButton id="gps_Button" aria-label="GPS">
            <GpsFixedIcon />
          </IconButton>
          <input
            id="search_input"
            type="text"
            placeholder="위치를 입력하세요"
            style={{
              boxSizing: `border-box`,
              border: `1px solid transparent`,
              width: `50%`,
              height: `32px`,
              marginTop: `27px`,
              padding: `0 12px`,
              borderRadius: `3px`,
              boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
              fontSize: `14px`,
              outline: `none`,
              textOverflow: `ellipses`,
              marginLeft: `26%`
            }}
          />
        </div>
      </SearchBox>
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
