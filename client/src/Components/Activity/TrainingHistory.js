import React, {useState, useEffect} from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import {getDaysArray} from '../../utils/common'

function TrainingHistory({activityType, duration, interval}) {
  const [data, setData] = useState([]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
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
    const user = await axios.get(`${process.env.REACT_APP_API_URL}/api/user/${sessionStorage.getItem('id')}`);
    // Get database activity data
    const activityData = await axios.get(`${process.env.REACT_APP_API_URL}/api/activity/strava/${user.data[0]._id}`);
    // Sort database activity data by sport
    const filteredActivityData = activityData.data.filter(ele => ele.activityType.includes(activityType));
    console.log(activityType)
    const today = new Date();
    let intervalList = [];
    let activityDates = [];
    if (interval === 'D'){
      intervalList = (getDaysArray(today.setDate(today.getDate()-duration),new Date()).map((ele)=>ele.toISOString().slice(5,10)));
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
  }, [activityType, duration, interval]);

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