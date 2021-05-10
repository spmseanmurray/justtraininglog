import React, {useState, useEffect} from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import {getDaysArray} from '../../utils/common'

function TrainingHistory({activityType, index, interval}) {
  const [data, setData] = useState([]);
  const [user, setUser] = useState();
  const [activityData, setActivityData] = useState();
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales:{
        x: {
            title: {display: true, text: 'Date'}
        },
        y: {
            title: {display: true, text: 'Distance [km]'}
        },
    },
  };
  useEffect(async () => {
    const tempUser = await axios.get(`${process.env.REACT_APP_API_URL}/api/user/${sessionStorage.getItem('id')}`)
    setUser(tempUser);
    // Get database activity data
    setActivityData(await axios.get(`${process.env.REACT_APP_API_URL}/api/activity/strava/${tempUser.data[0]._id}`));
  },[]);
  useEffect(async () => {
    // Sort database activity data by sport
    const filteredActivityData = typeof(activityData)==='undefined'?[]:activityData.data.filter(ele => ele.activityType.includes(activityType));
    let intervalList = [];
    let activityDates = [];
    const startDate = new Date();
    const endDate = new Date();
    if (interval === 'W'){
      intervalList = (getDaysArray(startDate.setDate(startDate.getDate()-7*(index+1)+1),endDate.setDate(endDate.getDate()-7*index)).map((ele)=>ele.toISOString().slice(5,10)));
      activityDates = (filteredActivityData.map((ele) => new Date(ele.activityDate)).map((ele)=>ele.toISOString().slice(5,10)));
    }else if (interval === 'M'){
      intervalList = (getDaysArray(startDate.setDate(startDate.getDate()-28*(index+1)+1),endDate.setDate(endDate.getDate()-28*index)).map((ele)=>ele.toISOString().slice(5,10)));
      activityDates = (filteredActivityData.map((ele) => new Date(ele.activityDate)).map((ele)=>ele.toISOString().slice(5,10)));
    }
    const activityDistances = intervalList.map((ele)=>{
      const idx = activityDates.indexOf(ele);
      return (idx === -1) ? 0 : filteredActivityData[idx].activityDistance;
    });

    // Set chart data and colors
    setData({
      labels: intervalList,
      datasets: [
        {
          label: activityType,
          data: activityDistances,
          backgroundColor: 'purple',
          borderColor: 'purple',
        },

      ] 
    });
  }, [activityType, index, interval, activityData]);

  return (
    <div>
    <div style = {{display:'flex',justifyContent:'center'}}>
      <div style = {{height:'25vh',width:'100vh',display:'flex', justifyContent:'center'}}>
        <Line data={data} options={options}/>
      </div>
    </div>
    </div>
  )
}
export default TrainingHistory