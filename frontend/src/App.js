import React, { Component,useState,useEffect} from "react";
import {PlacesWithStandaloneSearchBox} from "./components/Map";
import axios from "axios";

const App = () => {
  const [location,setLocation] = useState({lat:0,lng:0})
  const [userChat,setUserChat] = useState("")
  const [botResponse,setBotResponse] = useState("")

  const getChatBotResponse = () => {
    let botUrl = "http://attendance-map-env.eba-dfesbxdd.us-east-1.elasticbeanstalk.com"
    axios
    .post(`${botUrl}/api/chatwithbot`, {message: userChat})
    .then((res) => {
      setBotResponse(res.data.message)
    })
  }

  useEffect(()=> {
    navigator.geolocation.getCurrentPosition((position)=>{
      setLocation({lat:position.coords.latitude,lng:position.coords.longitude})
    })
  })
  
  return (
    <main className="container">
      <PlacesWithStandaloneSearchBox lat={location.lat} lng={location.lng} />
      <div style={{border: "solid 2px black", margin:"15px", textAlign: "center"}}>
        <input style={{width:"700px",margin:"5px"}} type="text" value={userChat} onChange={e => setUserChat(e.target.value)} /> 
        <button onClick={getChatBotResponse}> Send </button>
        <p></p>
        <span style={{fontWeight:"bold"}}>SUPPORT BOT RESPONSE: </span>
        <span>{botResponse}</span>
      </div>
    </main>
  );
}

export default App;
