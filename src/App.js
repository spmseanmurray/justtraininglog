import React, {useEffect} from 'react';
import axios from 'axios';
import {clientID,clientSecret,refreshToken,auth_link,activities_link,streams_link} from './utils/common'
import './App.css';
import { BrowserRouter} from 'react-router-dom';
import Routes from './utils/routes';

function App() {

  useEffect(async () => {
    const activityData = await axios.get(`http://localhost:5000/api/activity/`);
    // Get Strava activity data
    const stravaAuthResponse = await axios.post(`${auth_link}?client_id=${clientID}&client_secret=${clientSecret}&refresh_token=${refreshToken}&grant_type=refresh_token`);
    const config = {headers: { "Authorization": `Bearer ${stravaAuthResponse.data.access_token}` }};
    const stravaActivityData = await axios.get(`${activities_link}?access_token=${stravaAuthResponse.data.access_token}&per_page=${95}`);
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
  },[]);

  return (
    <div className="App">
      <BrowserRouter>
        <div> 
          <Routes/>
        </div>
      </BrowserRouter>
    </div>
  )}

export default App;
