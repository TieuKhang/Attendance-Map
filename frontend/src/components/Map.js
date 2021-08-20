import React, { Component,useState } from "react"
import axios from "axios";
const { compose, withProps, lifecycle } = require("recompose");
const {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  InfoWindow,
} = require("react-google-maps");
const { StandaloneSearchBox } = require("react-google-maps/lib/components/places/StandaloneSearchBox");
require('dotenv').config();
const url = "https://attendance-map.herokuapp.com"


const MapWithAMarker = compose(withScriptjs, withGoogleMap)(props => {

  const [attendance,setAttendance] = useState(0)

  let queryAddress = (addressArr,addressName) => {
    for (var i=0;i<addressArr.length;++i){
      if (addressArr[i].name === addressName)
        return [addressArr[i].attendance,addressArr[i].id]
    }
    return [0,0]
  }

  let getCurrentAttendace = (address) => {
    axios
    .get(`${url}/api/locationinfos/`)
    .then((res) => {
      let tempVal = queryAddress(res.data,address)
      console.log(tempVal[0])
      setAttendance(tempVal[0])
      return tempVal[0]
    })
  }

  let updateAttendance = (curAttendance,addressID,address,lat,lng,action) => {
    console.log(curAttendance)
    console.log(addressID)
    let item = {
      name:address,
      attendance:curAttendance,
      lat:lat,
      lot:lng,
    }
    setAttendance(curAttendance)
    console.log(item)
    if (curAttendance === 1 && action === "add"){
      axios
      .post(`${url}/api/locationinfos/`, item)
    } else {
      axios
        .put(`${url}/api/locationinfos/${addressID}/`, item)
    }
  }

  let createAttendance = (address,lat,lng) => {
    let addressID = 0
    let curAttendance = 0
    // check if address already exists
    axios
      .get(`${url}/api/locationinfos/`)
      .then((res) => {
        let tempVal = queryAddress(res.data,address)
        curAttendance = tempVal[0] + 1
        addressID = tempVal[1]
        if (tempVal[0] === 0 && tempVal[1] === 0)
          updateAttendance(curAttendance,addressID,address,lat,lng,"add")
        else
          updateAttendance(curAttendance,addressID,address,lat,lng,"update")
      })
  }

  let deleteAttendance = (address,lat,lng) => {
    let addressID = 0
    let curAttendance = 0
    // check if address already exists
    axios
      .get(`${url}/api/locationinfos/`)
      .then((res) => {
        let tempVal = queryAddress(res.data,address)
        if (tempVal[0]>0){
        curAttendance = tempVal[0] - 1
        addressID = tempVal[1]
        updateAttendance(curAttendance,addressID,address,lat,lng,"delete")
        }
      })
  } 

  return (
    <>
    {<GoogleMap defaultZoom={15} defaultCenter={{ lat: props.lat, lng: props.lng}} key={props.id}>
      {props.markers.map(marker => {
        const onClick = props.onClick.bind(this, marker)
        return (
          <Marker
            key={marker.place_id}
            onClick={onClick}
            position={{ lat: marker.geometry.location.lat(), lng: marker.geometry.location.lng() }}
          >
            {props.selectedMarker === marker &&
              <InfoWindow>
                <div style={{
                  flexDirection:'column',
                  margin: 5,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                  <div>
                    {marker.formatted_address}
                  </div>
                  <div>
                    {getCurrentAttendace(marker.formatted_address)}
                    Attendance:{attendance}
                  </div>
                  <div>
                    <button
                      style={{margin:5}}
                      onClick={()=>{createAttendance(marker.formatted_address,marker.geometry.location.lat(),marker.geometry.location.lng())}}
                    >
                      Add attendance
                    </button>
                  </div>
                  <div>
                    <button
                      onClick={()=>{deleteAttendance(marker.formatted_address,marker.geometry.location.lat(),marker.geometry.location.lng())}}
                    >
                      Remove attendance
                    </button>
                  </div>
                </div>
              </InfoWindow>}
          </Marker>
        )
      })}
    </GoogleMap>}
    </>
  )
})

export const PlacesWithStandaloneSearchBox = compose(
  withProps({
    googleMapURL: `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_API_KEY}&v=3.exp&libraries=geometry,drawing,places`,
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `400px` }} />,
  }),
  lifecycle({
    componentWillMount() {
      const refs = {}

      this.setState({
        places: [],
        selectedMarker: false,        
        id: false,
        onSearchBoxMounted: ref => {
          refs.searchBox = ref;
        },
        onPlacesChanged: () => {
          const places = refs.searchBox.getPlaces();
          if (places.length>0) {
            this.setState({
              lat: places[0].geometry.location.lat(), 
              lng: places[0].geometry.location.lng()
            })
          }
          this.setState({
            places, 
          });
          this.setState(prevState => ({ id: !prevState.id }));
        },
        handleClick: (marker,event) => {
          this.setState({ selectedMarker: marker });
          this.setState(prevState => ({ id: !prevState.id }));
        }
      })
    },
  }),
  withScriptjs  
)(props =>
  <div data-standalone-searchbox="" >
    <h1 style={{textAlign:'center'}}>ATTENDANCE MAP</h1>
    <h6 style={{textAlign:'center'}}>
      For this map, you can search for the places you want to visit and check theirs attendance.
      You can also add or remove your attendance at a certain place to help other users be informed about the destination. 
    </h6>    
    <div style={{flexDirection:'column',display:'flex',alignItems:'center',justifyContent:'center',margin:"5%"}}>
      <StandaloneSearchBox
        ref={props.onSearchBoxMounted}
        bounds={props.bounds}
        onPlacesChanged={props.onPlacesChanged}
      >
        <input
          type="text"
          placeholder="Customized your placeholder"
          style={{
            boxSizing: `border-box`,
            border: `1px solid transparent`,
            width: `240px`,
            height: `32px`,
            padding: `0 12px`,
            borderRadius: `3px`,
            boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
            fontSize: `14px`,
            outline: `none`,
            textOverflow: `ellipses`,
          }}
        />
      </StandaloneSearchBox>
    </div>
    <MapWithAMarker
        key={props.id}
        selectedMarker={props.selectedMarker}
        markers={props.places}
        onClick={props.handleClick}
        googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_API_KEY}&v=3.exp&libraries=geometry,drawing,places`}
        loadingElement={<div style={{ height: `100%` }} />}
        containerElement={<div style={{ height: `400px` }} />}
        mapElement={<div style={{ height: `100%` }} />}
        lat={props.lat}
        lng={props.lng}
    />
    <ol>
      {props.places.map(({ place_id, formatted_address, geometry: { location } }) =>
        <li key={place_id}>
          {formatted_address}
          {" at "}
          ({location.lat()}, {location.lng()})
        </li>
      )
      }
    </ol>
  </div>
);
