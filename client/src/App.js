import React, {useEffect} from 'react';
import axios from 'axios';
import {auth_link,activities_link,streams_link,fancyTimeFormat,getTimePerZone} from './utils/common'
import './App.css';
import { BrowserRouter} from 'react-router-dom';
import Routes from './routes/routes';


function App() {
  document.title = " Just Training Log";
  useEffect(async () => {
    const activityData = await axios.get(`${process.env.REACT_APP_API_URL}/api/activity/`);
    const user = await axios.get(`${process.env.REACT_APP_API_URL}/api/user/${sessionStorage.getItem('id')}`);
    const stravaAuthResponse = await axios.post(`${auth_link}?client_id=${user.data[0].stravaClientID}&client_secret=${user.data[0].stravaClientSecret}&refresh_token=${user.data[0].stravaClientRefreshToken}&grant_type=refresh_token`);
    const config = {headers: { "Authorization": `Bearer ${stravaAuthResponse.data.access_token}` }};
    const stravaActivityData = await axios.get(`${activities_link}?access_token=${stravaAuthResponse.data.access_token}&per_page=${90}`);
    let dbActivityIDs = activityData.data.map(ele => ele.activityID);
    let stravaActivityIDs = stravaActivityData.data.map(ele => ele.id);
    let filteredStravaActivityIDs = stravaActivityIDs.filter(ele => dbActivityIDs.indexOf(ele) === -1);

    for (var i = 0; i < filteredStravaActivityIDs.length; i++){
      const stream = await axios.get(`${streams_link}${filteredStravaActivityIDs[i]}/streams?key_by_type=true&keys=time,velocity_smooth,heartrate,altitude`,config);
      const idx = stravaActivityIDs.indexOf(filteredStravaActivityIDs[i]);
      const pace = stream.data.velocity_smooth.data.map(ele => (1000/60/ele)).filter(ele => ele != Infinity).map(ele=>Math.round((ele+Number.EPSILON)*100)/100);
      const payload = {
        _stravaID: stravaActivityData.data[idx].athlete.id,
        activityID: filteredStravaActivityIDs[i],
        activityName: stravaActivityData.data[idx].name,
        activityDistance: (Math.round((stravaActivityData.data[idx].distance/1000 + Number.EPSILON)*100)/100),
        activityTime: fancyTimeFormat(stravaActivityData.data[idx].elapsed_time),
        activityDate: new Date(stravaActivityData.data[idx].start_date).toISOString().slice(0,10),
        activityType: stravaActivityData.data[idx].type,
        averagePace: fancyTimeFormat(Math.round((pace.reduce((a, b) => (a + b))/pace.length + Number.EPSILON)*100)/100*60),
        timeStream: stream.data.time.data,
        distanceStream: stream.data.distance.data.map(ele => Math.round(ele+Number.EPSILON)/1000),
        heartrateStream: stream.data.heartrate.data,
        elevationStream: stream.data.hasOwnProperty('altitude') ? stream.data.altitude.data.map(ele => ele - stream.data.altitude.data[0]) : 0,
        paceStream: pace,
        timePerHRZone: getTimePerZone(stream)
      };
      try {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/activity/`, payload);
      } catch (err) {console.error(err.message)}
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
