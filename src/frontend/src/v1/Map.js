import React from "react"
import { withScriptjs, withGoogleMap, GoogleMap, Marker, InfoWindow } from "react-google-maps"
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ShareIcon from '@material-ui/icons/Share';
import SearchIcon from '@material-ui/icons/Search';
import GpsFixedIcon from '@material-ui/icons/GpsFixed';
const { SearchBox } = require("react-google-maps/lib/components/places/SearchBox");
const resultMarkerIcon = {
  url: require('../images/result-marker.png'),
  scaledSize: {width: 30, height:30}
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
    const refs = {}

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
        console.log("bound2", bounds)
        const nextMarkers = places.map(place => ({
          position: place.geometry.location,
        }));
        console.log("place2", places);

        let nextCenter = places[0].geometry.location;

        this.setState({
          center: nextCenter,
          markers: nextMarkers,
        });

        this.props.setMarker({
          lat: places[0].geometry.location.lat(),
          lng: places[0].geometry.location.lng(),
          index: this.props.selectedMarker
        });
      },
    })
  }

  onMapClick = (event) => {
    this.props.setMarker({
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
      index: this.props.selectedMarker
    });
  }

  onMarkerChange = (event, index) => {
    console.log(index);
    this.props.setMarker({
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
      index: index
    });
  };

  showMarkers() {
    let visibleMarkers = [];

    if (this.props.showResult != true){
      for (let i = 0; i< this.props.markers.length; i++) {
        visibleMarkers.push(
          <Marker position={{ lat: this.props.markers[i].location.lat, lng: this.props.markers[i].location.lng }} draggable={true} onClick={this.onMarkerChange} onDragEnd={(e) => this.onMarkerChange(e, i)} label={(i+1).toString()} >
          </Marker>
        )
      }
    } else {
      for (let i = 0; i< this.props.markers.length; i++) {
        visibleMarkers.push(
          <Marker position={{ lat: this.props.markers[i].location.coordinates[1], lng: this.props.markers[i].location.coordinates[0] }} draggable={false} onClick={() => alert(this.props.markers[i].name)} icon={resultMarkerIcon} label={(i+1).toString()}>
            <InfoWindow>
              <div>
                {this.props.markers[i].name}
              </div>
            </InfoWindow>
          </Marker>
        )
      }
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
          <IconButton id="m_side_area_share_btn" color="inherit" aria-label="Share">
            <ShareIcon />
          </IconButton>
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
