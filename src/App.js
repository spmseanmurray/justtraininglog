import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {clientID,clientSecret,refreshToken,auth_link,activities_link,getDaysArray} from './utils/common'
import './App.css';
import ActivityHistory from './Components/ActivityHistory';
import HRZoneHistory from './Components/HRZoneHistory';
import Header from './Components/Header';

function App() {

  useEffect(async () => {
    const activityData = await axios.get(`http://localhost:5000/api/activity/`);
    // Get Strava activity data
    const stravaAuthResponse = await axios.post(`${auth_link}?client_id=${clientID}&client_secret=${clientSecret}&refresh_token=${refreshToken}&grant_type=refresh_token`);
    const stravaActivityData = await axios.get(`${activities_link}?access_token=${stravaAuthResponse.data.access_token}`);
    console.log(activityData.data.map(ele => ele.activityID));
    console.log(stravaActivityData.data.map(ele => ele.id));
  },[]);

  return (
    <div className="App">
      <Header/>
      {/* <ActivityHistory /> */}
      {/* <HRZoneHistory /> */}
    </div>
  )}

export default App;
