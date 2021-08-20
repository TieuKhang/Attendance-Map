import React, { Component,useState,useEffect} from "react";
import {PlacesWithStandaloneSearchBox} from "./components/Map";
import axios from "axios";

const App = () => {
  const [location,setLocation] = useState({lat:0,lng:0})

  useEffect(()=> {
    navigator.geolocation.getCurrentPosition((position)=>{
      setLocation({lat:position.coords.latitude,lng:position.coords.longitude})
    })
  })
  
  return (
    <main className="container">
      <PlacesWithStandaloneSearchBox lat={location.lat} lng={location.lng} />
    </main>
  );
}

export default App;
