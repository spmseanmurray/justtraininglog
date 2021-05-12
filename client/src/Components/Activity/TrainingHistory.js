import React, {useState, useEffect} from 'react';
import { Line } from 'react-chartjs-2';
import {getDaysArray, getWeeksArray, getMonthsArray, monthNames} from '../../utils/common'

function TrainingHistory({activityData, activityType, index, interval, type}) {
  const [data, setData] = useState([]);
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
            title: {display: true, text: interval==='W'||interval==='M'?'Date':interval==='Q'?'Week #':'Month'}
        },
        y: {
            title: {display: true, text: type==='distance'?'Distance [km]':'TSS'},
            beginAtZero: true,
        },
    },
  };

  useEffect(async () => {
    // Sort database activity data by sport
    const filteredActivityData = typeof(activityData)==='undefined'?[]:activityType==='All'?activityData.data:activityData.data.filter(ele => ele.activityType.includes(activityType));
    let intervalList = [];
    let activitySums = [];
    const startDate = new Date();
    const endDate = new Date();
    if (interval === 'W'){
      intervalList = (getDaysArray(startDate.setDate(startDate.getDate()-7*(index+1)+1),endDate.setDate(endDate.getDate()-7*index)).map((ele)=>ele.toISOString().slice(5,10)));
      filteredActivityData.map(ele => {ele.filteredDate = new Date(ele.activityDate).toISOString().slice(5,10)});
    }else if (interval === 'M'){
      intervalList = (getDaysArray(startDate.setDate(startDate.getDate()-28*(index+1)+1),endDate.setDate(endDate.getDate()-28*index)).map((ele)=>ele.toISOString().slice(5,10)));
      filteredActivityData.map(ele => {ele.filteredDate = new Date(ele.activityDate).toISOString().slice(5,10)});
    }else if (interval === 'Q'){
      intervalList = getWeeksArray(startDate.setDate(startDate.getDate()-84*(index+1)+1),endDate.setDate(endDate.getDate()-84*index));
      filteredActivityData.map(ele=>{ele.filteredDate = new Date(ele.activityDate).getWeek()});
    }else if (interval === 'Y'){
      intervalList = getMonthsArray(endDate.setYear(endDate.getYear()-index));
      filteredActivityData.map(ele=>{ele.filteredDate = monthNames[new Date(ele.activityDate).getMonth()]});
    }
    if(type === 'distance'){
      activitySums = intervalList.map(ele => filteredActivityData.filter(e => e.filteredDate===ele).reduce((sum, curr) => sum + curr.activityDistance, 0))
    }else if (type === 'TSS'){
      activitySums = intervalList.map(ele => filteredActivityData.filter(e => e.filteredDate===ele).reduce((sum, curr) => sum + curr.activityTSS, 0))
    }
    
    

    // Set chart data and colors
    setData({
      labels: intervalList,
      datasets: [
        {
          label: activityType,
          data: activitySums,
          backgroundColor: 'purple',
          borderColor: 'purple',
        },

      ] 
    });
  }, [activityData, activityType, index, interval, activityData]);

  return (
    <div>
    <div style = {{display:'flex',justifyContent:'center'}}>
      <div style = {{height:'25vh',width:'95vh',display:'flex', justifyContent:'center'}}>
        <Line data={data} options={options}/>
      </div>
    </div>
    </div>
  )
}
export default TrainingHistory