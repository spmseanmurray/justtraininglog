import React, {useState, useEffect} from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import {getDaysArray} from '../utils/common'

function ActivityHistory() {
  const [data, setData] = useState([]);

  useEffect(async () => {
    // Get database activity data
    const activityData = await axios.get(`${process.env.REACT_APP_API_URL}/api/activity/`);
    // Sort database activity data by sport
    const swimData = activityData.data.filter(ele => ele.activityType.includes('Swim'));
    const bikeData =  activityData.data.filter(ele => ele.activityType.includes('Ride'));
    const runData =  activityData.data.filter(ele => ele.activityType.includes('Run'));

    // Generate array of previous 28 days and arrays of every day with an activity by sport
    const today = new Date();
    const daylist = getDaysArray(today.setDate(today.getDate()-27),new Date()).map((ele)=>ele.toISOString().slice(0,10));
    const swimDates = swimData.map((ele) => new Date(ele.activityDate)).map((ele)=>ele.toISOString().slice(0,10));
    const bikeDates = bikeData.map((ele) => new Date(ele.activityDate)).map((ele)=>ele.toISOString().slice(0,10));
    const runDates = runData.map((ele) => new Date(ele.activityDate)).map((ele)=>ele.toISOString().slice(0,10));

    // Generate array of distance by sport for each of the previous 28 days
    const swimDistances = daylist.map((ele)=>{
      const idx = swimDates.indexOf(ele);
      return (idx === -1) ? 0 : swimData[idx].activityDistance;
    });
    const bikeDistances = daylist.map((ele)=>{
      const idx = bikeDates.indexOf(ele);
      return (idx === -1) ? 0 : bikeData[idx].activityDistance;
    });
    const runDistances = daylist.map((ele)=>{
      const idx = runDates.indexOf(ele);
      return (idx === -1) ? 0 : runData[idx].activityDistance;
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
    <div>
    <div style = {{height:'5vh',display:'flex', alignItems:'center',justifyContent:'center'}}></div>
    <div style = {{height:'80vh',display:'flex', alignItems:'center',justifyContent:'center'}}>
      <div style = {{height:'80vh',width:'80vw',display:'flex', alignItems:'center',justifyContent:'center'}}>
        <Bar data={data} options={{ responsive: true, maintainAspectRatio: false, }}/>
      </div>
    </div>
    </div>
  )
}
export default ActivityHistory