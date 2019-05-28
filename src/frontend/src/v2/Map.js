import React from "react"
import './Map.css'
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
const searchMarkerIcon = {
  url: require('../images/marker_green.png'),
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

    if (this.props.searchPoint.control) {
      geocoder.geocode({'location': {lat: event.latLng.lat(), lng: event.latLng.lng()}}, (results, status) => {
        if (status == 'OK') {
          this.props.setSearchPoint({
            lat: event.latLng.lat(),
            lng: event.latLng.lng(),
            where: results[0].formatted_address
          });
        } else {
          console.log('Geocode was not successful for the following reason: ' + status);
        }
      });

      console.log(this.props.searchPoint);

      return ;
    }

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

    if (this.props.searchPoint.active) {
      visibleMarkers.push(
        <Marker position={{ lat: this.props.searchPoint.location.lat, lng: this.props.searchPoint.location.lng }} onClick={() => console.log(this.props.searchPoint)} animation={1} icon={searchMarkerIcon}>
        </Marker>
      )
    }

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
  };

  searchPoint() {
    if (!this.props.searchPoint.active && !this.props.searchPoint.control) {
      return "검색기준 위치지정"
    } else if(this.props.searchPoint.active && this.props.searchPoint.control) {
      return "검색기준 위치지정 취소"
    } else if(this.props.searchPoint.active && !this.props.searchPoint.control) {
      return "검색기준위치 제거"
    }
  };

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

      <SearchBox controlPosition={window.google.maps.ControlPosition.BOTTOM_CENTER}>
        <div>
          <table class='search-point-table'><td>
        {this.props.resultAreas.length == 0 ?
          (<button class="btn btn-share"  onClick={this.props.clickSearchButton}>
              {this.searchPoint()}
          </button>) : (<div></div>)
        }</td>
        <td style ={this.props.resultAreas.length != 0 ? {display:"none"} : {}}><div type="button" class='tooltip'>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 437.6 437.6" height="2.5em" fill="#2092EC">
      			<path d="M194,142.8c0.8,1.6,1.6,3.2,2.4,4.4c0.8,1.2,2,2.4,2.8,3.6c1.2,1.2,2.4,2.4,4,3.6c1.2,0.8,2.8,2,4.8,2.4 c1.6,0.8,3.2,1.2,5.2,1.6c2,0.4,3.6,0.4,5.2,0.4c1.6,0,3.6,0,5.2-0.4c1.6-0.4,3.2-0.8,4.4-1.6h0.4c1.6-0.8,3.2-1.6,4.8-2.8 c1.2-0.8,2.4-2,3.6-3.2l0.4-0.4c1.2-1.2,2-2.4,2.8-3.6s1.6-2.4,2-4c0-0.4,0-0.4,0.4-0.8c0.8-1.6,1.2-3.6,1.6-5.2 c0.4-1.6,0.4-3.6,0.4-5.2s0-3.6-0.4-5.2c-0.4-1.6-0.8-3.2-1.6-5.2c-1.2-2.8-2.8-5.2-4.8-7.2c-0.4-0.4-0.4-0.4-0.8-0.8 c-1.2-1.2-2.4-2-4-3.2c-1.6-0.8-2.8-1.6-4.4-2.4c-1.6-0.8-3.2-1.2-4.8-1.6c-2-0.4-3.6-0.4-5.2-0.4c-1.6,0-3.6,0-5.2,0.4 c-1.6,0.4-3.2,0.8-4.8,1.6H208c-1.6,0.8-3.2,1.6-4.4,2.4c-1.6,1.2-2.8,2-4,3.2c-1.2,1.2-2.4,2.4-3.2,3.6 c-0.8,1.2-1.6,2.8-2.4,4.4c-0.8,1.6-1.2,3.2-1.6,4.8c-0.4,2-0.4,3.6-0.4,5.2c0,1.6,0,3.6,0.4,5.2 C192.8,139.6,193.6,141.2,194,142.8z"/>
      			<path d="M249.6,289.2h-9.2v-98c0-5.6-4.4-10.4-10.4-10.4h-42c-5.6,0-10.4,4.4-10.4,10.4v21.6c0,5.6,4.4,10.4,10.4,10.4h8.4v66.4 H188c-5.6,0-10.4,4.4-10.4,10.4v21.6c0,5.6,4.4,10.4,10.4,10.4h61.6c5.6,0,10.4-4.4,10.4-10.4V300 C260,294,255.2,289.2,249.6,289.2z"/>
      			<path d="M218.8,0C98,0,0,98,0,218.8s98,218.8,218.8,218.8s218.8-98,218.8-218.8S339.6,0,218.8,0z M218.8,408.8 c-104.8,0-190-85.2-190-190s85.2-190,190-190s190,85.2,190,190S323.6,408.8,218.8,408.8z"/>
          </svg>
          <span class="tooltiptext">검색기준 위치지정은 사용자가 검색할 중심을 직접 정할 수 있는 기능입니다.</span>
        </div></td>
        </table>
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
