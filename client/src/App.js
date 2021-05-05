import React, {useEffect} from 'react';
import axios from 'axios';
import {auth_link,activities_link,streams_link,fancyTimeFormat,getTimePerZone} from './utils/common';
import {apiUpdateUser} from './utils/api';
import './App.css';
import { BrowserRouter} from 'react-router-dom';
import Routes from './routes/routes';


function App() {
  document.title = " Just Training Log";

  useEffect(async () => {
    if(sessionStorage.getItem('id')){
      const user = await axios.get(`${process.env.REACT_APP_API_URL}/api/user/${sessionStorage.getItem('id')}`);
      const activityData = await axios.get(`${process.env.REACT_APP_API_URL}/api/activity/strava/${user.data[0]._userID}`);
      console.log(activityData);
      const id = await sessionStorage.getItem('id');
      let config, stravaActivityData;
      
      if(user.data[0].stravaAuthTokenExpiration < Date.now()*1000){
        config = {headers: {"Authorization": `Bearer ${user.data[0].stravaAuthToken}`}};
        stravaActivityData = await axios.get(`${activities_link}?access_token=${user.data[0].stravaAuthToken}&per_page=${90}`);
      }else{
        const auth_data = await axios.post(`${auth_link}?client_id=${process.env.REACT_APP_CLIENT_ID}&client_secret=${process.env.REACT_APP_CLIENT_SECRET}&refresh_token=${user.data[0].stravaRefreshToken}&grant_type=refresh_token`);
        const payload = {
          stravaAuthToken: auth_data.data.access_token,
          stravaAuthTokenExpiration: auth_data.data.expires_at,
        };
        await apiUpdateUser(id, payload);
        config = {headers: {"Authorization": `Bearer ${auth_data.data.access_token}`}};
        stravaActivityData = await axios.get(`${activities_link}?access_token=${auth_data.data.access_token}&per_page=${90}`);
      }
      let dbActivityIDs = activityData.data.map(ele => ele.activityID);
      let stravaActivityIDs = stravaActivityData.data.map(ele => ele.id);
      let filteredStravaActivityIDs = stravaActivityIDs.filter(ele => dbActivityIDs.indexOf(ele) === -1);

      for (var i = 0; i < filteredStravaActivityIDs.length; i++){
        const stream = await axios.get(`${streams_link}${filteredStravaActivityIDs[i]}/streams?key_by_type=true&keys=time,velocity_smooth,heartrate,altitude`,config);
        const idx = stravaActivityIDs.indexOf(filteredStravaActivityIDs[i]);
        const pace = stream.data.velocity_smooth.data.map(ele => (1000/60/ele)).filter(ele => ele != Infinity).map(ele=>Math.round((ele+Number.EPSILON)*100)/100);
        console.log(stream);
        const payload = {
          _userID: id,
          activityID: filteredStravaActivityIDs[i],
          activityName: stravaActivityData.data[idx].name,
          activityDistance: (Math.round((stravaActivityData.data[idx].distance/1000 + Number.EPSILON)*100)/100),
          activityTime: fancyTimeFormat(stravaActivityData.data[idx].elapsed_time),
          activityDate: new Date(stravaActivityData.data[idx].start_date).toISOString().slice(0,10),
          activityType: stravaActivityData.data[idx].type,
          averagePace: fancyTimeFormat(Math.round((pace.reduce((a, b) => (a + b))/pace.length + Number.EPSILON)*100)/100*60),
          timeStream: stream.data.time.data,
          distanceStream: stream.data.distance.data.map(ele => Math.round(ele+Number.EPSILON)/1000),
          heartrateStream: stream.data.hasOwnProperty('heartrate') ? stream.data.heartrate.data : [],
          elevationStream: stream.data.hasOwnProperty('altitude') ? stream.data.altitude.data.map(ele => ele - stream.data.altitude.data[0]) : 0,
          paceStream: pace,
          timePerHRZone: stream.data.hasOwnProperty('heartrate') ? getTimePerZone(stream) : [0,0,0,0,0,0],
        };
        try {
          const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/activity/`, payload);
        } catch (err) {console.error(err.message)}
      }
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
