import React, {useState, useEffect} from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import {clientID,clientSecret,refreshToken,auth_link,activities_link,getDaysArray} from '../utils/common'

function ActivityHistory() {
  const [data, setData] = useState([]);

  useEffect(async () => {
    // Get Strava activity data
    const stravaAuthResponse = await axios.post(`${auth_link}?client_id=${clientID}&client_secret=${clientSecret}&refresh_token=${refreshToken}&grant_type=refresh_token`);
    const activityData = await axios.get(`${activities_link}?access_token=${stravaAuthResponse.data.access_token}`);

    // Sort Strava activity data by sport
    const swimData = activityData.data.filter(ele => ele.type.includes('Swim'));
    const bikeData =  activityData.data.filter(ele => ele.type.includes('Ride'));
    const runData =  activityData.data.filter(ele => ele.type.includes('Run'));

    // Generate array of previous 28 days and arrays of every day with an activity by sport
    const today = new Date();
    const daylist = getDaysArray(today.setDate(today.getDate()-27),new Date()).map((ele)=>ele.toISOString().slice(0,10));
    const swimDates = swimData.map((ele) => new Date(ele.start_date)).map((ele)=>ele.toISOString().slice(0,10));
    const bikeDates = bikeData.map((ele) => new Date(ele.start_date)).map((ele)=>ele.toISOString().slice(0,10));
    const runDates = runData.map((ele) => new Date(ele.start_date)).map((ele)=>ele.toISOString().slice(0,10));

    // Generate array of distance by sport for each of the previous 28 days
    const swimDistances = daylist.map((ele)=>{
      const idx = swimDates.indexOf(ele);
      return (idx === -1) ? 0 : swimData[idx].distance/1000;
    });
    const bikeDistances = daylist.map((ele)=>{
      const idx = bikeDates.indexOf(ele);
      return (idx === -1) ? 0 : bikeData[idx].distance/1000;
    });
    const runDistances = daylist.map((ele)=>{
      const idx = runDates.indexOf(ele);
      return (idx === -1) ? 0 : runData[idx].distance/1000;
    });

    // Set chart data and colors
    setData({
      labels: daylist,
      datasets: [
        {
          label: 'Swim',
          data: swimDistances,
          backgroundColor: 'rgb(54, 162, 235)',
          borderColor: 'rgba(54, 162, 235, 0.2)',
        },
        {
          label: 'Bike',
          data: bikeDistances,
          backgroundColor: 'rgb(255, 99, 132)',
          borderColor: 'rgba(255, 99, 132, 0.2)',
        },
        {
          label: 'Run',
          data: runDistances,
          backgroundColor: 'rgb(138, 43, 226)',
          borderColor: 'rgba(138, 43, 226, 0.2)'
        }
      ] 
    });
  }, []);

  return (
    <div style = {{height:'100vh',display:'flex', alignItems:'center',justifyContent:'center'}}>
      <div style = {{height:'75vh',width:'75vw',display:'flex', alignItems:'center',justifyContent:'center'}}>
        <Bar data={data} />
      </div>
    </div>
  )
}
export default ActivityHistory