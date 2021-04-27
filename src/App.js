import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {clientID,clientSecret,refreshToken,auth_link,activities_link,streams_link} from './utils/common'
import './App.css';
import ActivityHistory from './Components/ActivityHistory';
import HRZoneHistory from './Components/HRZoneHistory';
import Header from './Components/Header';

function App() {

  useEffect(async () => {
    const activityData = await axios.get(`http://localhost:5000/api/activity/`);
    // Get Strava activity data
    const stravaAuthResponse = await axios.post(`${auth_link}?client_id=${clientID}&client_secret=${clientSecret}&refresh_token=${refreshToken}&grant_type=refresh_token`);
    const config = {headers: { "Authorization": `Bearer ${stravaAuthResponse.data.access_token}` }};
    const stravaActivityData = await axios.get(`${activities_link}?access_token=${stravaAuthResponse.data.access_token}`);
    console.log(stravaActivityData);
    let dbActivityIDs = activityData.data.map(ele => ele.activityID);
    let stravaActivityIDs = stravaActivityData.data.map(ele => ele.id);
    let filteredStravaActivityIDs = stravaActivityIDs.filter(ele => dbActivityIDs.indexOf(ele) === -1);

    for (var i = 0; i < filteredStravaActivityIDs.length; i++){
      const stream = await axios.get(`${streams_link}${filteredStravaActivityIDs[i]}/streams?key_by_type=true&keys=time,velocity_smooth,heartrate`,config);
      const idx = stravaActivityIDs.indexOf(filteredStravaActivityIDs[i]);
      const payload = {
        _stravaID: stravaActivityData.data[idx].athlete.id,
        activityID: filteredStravaActivityIDs[i],
        activityName: stravaActivityData.data[idx].name,
        activityDistance: stravaActivityData.data[idx].distance,
        activityTime: stravaActivityData.data[idx].elapsed_time,
        activityDate: stravaActivityData.data[idx].start_date,
        activityType: stravaActivityData.data[idx].type,
        timeStream: stream.data.time.data,
        distanceStream: stream.data.distance.data,
        heartrateStream: stream.data.heartrate.data,
        speedStream: stream.data.velocity_smooth.data
      };
      try {
        const res = await axios.post(`http://localhost:5000/api/activity/`,payload);
      } catch (err) {console.error(err.message);}
    }
    console.log(dbActivityIDs);
    console.log(stravaActivityIDs);
    console.log(filteredStravaActivityIDs);
  },[]);

  return (
    <div className="App">
      <Header/>
      {/* <ActivityHistory /> */}
      {/* <HRZoneHistory /> */}
    </div>
  )}

export default App;
