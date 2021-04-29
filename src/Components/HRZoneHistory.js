import React, {useState, useEffect} from 'react';
import { Doughnut } from 'react-chartjs-2';
import axios from 'axios';
import {fancyTimeFormat, HRZones} from '../utils/common'
import { DataGrid } from '@material-ui/data-grid';

function HRZoneHistory() {
    const [HRZoneData, setHRZoneData] = useState([]);
    const [HRRows, setHRRows] = useState([]);
    const [HRColumns, setHRColumns] = useState([]);
    const options = {
      plugins: {
        legend: {
          position: 'left',
        },
      },
    };
    useEffect(async () => {
        // Get database activity HR data
        const activityData = await axios.get(`http://localhost:5000/api/activity/`);
        let HRStreams = new Array(activityData.data.length).fill({});
        let totalTimePerHRZone = new Array(HRZones.length).fill(0);
        let timesPerHRZone = new Array(activityData.data.length).fill({});
  
        for (var i = 0; i < activityData.data.length; i++){
          const tempTime = activityData.data[i].timeStream.map(ele => ele-activityData.data[i].timeStream[activityData.data[i].timeStream.indexOf(ele)-1]); 
          tempTime[0] = 0; 
          HRStreams[i]= {
            timeDelta: tempTime,
            heartrate: activityData.data[i].heartrateStream,
          };
          const timePerHRZone = new Array(HRZones.length).fill(0);
          for(var j = 0; j < HRZones.length; j++){
            for (var k = 0; k < HRStreams[i].timeDelta.length; k++) {
              if (j===0 && HRStreams[i].heartrate[k] < HRZones[j]) {
                timePerHRZone[j] += HRStreams[i].timeDelta[k];
                totalTimePerHRZone[j] += HRStreams[i].timeDelta[k];
              }
              else if (j>0 && HRStreams[i].heartrate[k] >= HRZones[j-1] && HRStreams[i].heartrate[k] < HRZones[j] ){
                timePerHRZone[j] += HRStreams[i].timeDelta[k];
                totalTimePerHRZone[j] += HRStreams[i].timeDelta[k];
              }
            }
          }
  
          timesPerHRZone[i] = timePerHRZone.map(ele => fancyTimeFormat(ele)); 
        }
        const HRZoneLabels = ['Zone 0','Zone 1','Zone 2','Zone 3','Zone 4','Zone 5'];
        const percentPerZone = totalTimePerHRZone.map(ele => ele/totalTimePerHRZone.reduce(function(a, b){return a + b;}, 0)*100);
        setHRZoneData({
            labels: HRZoneLabels,
            datasets: [
              {
                label: 'Time',
                data: percentPerZone.map(ele => Math.round((ele + Number.EPSILON) * 100) / 100),
                backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(255, 206, 86, 0.2)',
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(153, 102, 255, 0.2)',
                  'rgba(255, 159, 64, 0.2)',
                ],
                borderColor: [
                  'rgba(255, 99, 132, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)',
                ],
                borderWidth: 1,
                hoverOffset: 4,
                radius: '65%',
                position: 'left'
              }]
          });
        setHRColumns([
            { field: 'zone', headerName: 'Heart Rate Zone', width: '11vw' },
            { field: 'time', headerName: 'Total Time (H:M:S)', width: '13vw'},
            { field: 'percent', headerName: 'Percentage (%)', width: '11vw'},
        ]);
        setHRRows([
           { id: 0, zone: HRZoneLabels[0],time: fancyTimeFormat(totalTimePerHRZone[0]), percent: Math.round((percentPerZone[0] + Number.EPSILON) * 100) / 100},
           { id: 1, zone: HRZoneLabels[1],time: fancyTimeFormat(totalTimePerHRZone[1]), percent: Math.round((percentPerZone[1] + Number.EPSILON) * 100) / 100},
           { id: 2, zone: HRZoneLabels[2],time: fancyTimeFormat(totalTimePerHRZone[2]), percent: Math.round((percentPerZone[2] + Number.EPSILON) * 100) / 100},
           { id: 3, zone: HRZoneLabels[3],time: fancyTimeFormat(totalTimePerHRZone[3]), percent: Math.round((percentPerZone[3] + Number.EPSILON) * 100) / 100},
           { id: 4, zone: HRZoneLabels[4],time: fancyTimeFormat(totalTimePerHRZone[4]), percent: Math.round((percentPerZone[4] + Number.EPSILON) * 100) / 100},
           { id: 5, zone: HRZoneLabels[5],time: fancyTimeFormat(totalTimePerHRZone[5]), percent: Math.round((percentPerZone[5] + Number.EPSILON) * 100) / 100},
        ]);
      }, []);

    return (
        <>
        <div>
        <div style = {{display:'flex', alignItems:'center',justifyContent:'center'}}>
            <h3>Time Per Heartrate Zone</h3>
        </div>
        <div style = {{height:'70vh',display:'flex', alignItems:'center',justifyContent:'center'}}>
          <div style = {{height:'100vh',width:'60vw',display:'flex', alignItems:'center',justifyContent:'center'}}>
            <Doughnut data={HRZoneData} options = {options}/>
          </div>
         <div style = {{height:'100vh',width:'35vw',display:'flex', alignItems:'center',justifyContent:'center'}}>
            <DataGrid rows={HRRows} columns={HRColumns} density={'compact'} pageSize={6} disableColumnMenu={true} disableColumnSelector={true} autoHeight={true} hideFooter={true} />      
          </div>  
        </div>
        </div>
        </>
    )
}
export default HRZoneHistory