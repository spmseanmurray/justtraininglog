import React, {useState, useEffect} from 'react';
import { Doughnut } from 'react-chartjs-2';
import axios from 'axios';
import {clientID,clientSecret,refreshToken,auth_link,activities_link,streams_link,fancyTimeFormat, HRZones} from '../utils/common'
import { DataGrid } from '@material-ui/data-grid';
import { makeStyles, useTheme } from "@material-ui/core";

function HRZoneHistory() {
    const [HRZoneData, setHRZoneData] = useState([]);
    const [HRRows, setHRRows] = useState([]);
    const [HRColumns, setHRColumns] = useState([]);
    const useStyles = makeStyles(theme => ({
        root: {
          "& .MuiDataGrid-columnsContainer:": {
            backgroundColor: "#002D72"
          }
        }
      }));
    const classes = useStyles();
    useEffect(async () => {
        // Get Strava activity HR data
        const stravaAuthResponse = await axios.post(`${auth_link}?client_id=${clientID}&client_secret=${clientSecret}&refresh_token=${refreshToken}&grant_type=refresh_token`);
        const config = {headers: { "Authorization": `Bearer ${stravaAuthResponse.data.access_token}` }};
        const activityData = await axios.get(`${activities_link}?access_token=${stravaAuthResponse.data.access_token}`);
        let streams = new Array(activityData.data.length).fill({});
        let HRStreams = new Array(activityData.data.length).fill({});
        let totalTimePerHRZone = new Array(HRZones.length).fill(0);
        let timesPerHRZone = new Array(activityData.data.length).fill({});
  
        for (var i = 0; i < activityData.data.length; i++){
          const stream = await axios.get(`${streams_link}${activityData.data[i].id}/streams?key_by_type=true&keys=time,velocity_smooth,heartrate`,config);
          streams[i] = stream;
          const tempTime = stream.data.time.data.map(ele => ele-stream.data.time.data[stream.data.time.data.indexOf(ele)-1]); 
          tempTime[0] = 0; 
          HRStreams[i]= {
            timeDelta: tempTime,
            heartrate: stream.data.heartrate.data,
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
                data: percentPerZone,
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
              }]
          });
        setHRColumns([
            { field: 'zone', headerName: 'Heart Rate Zone', width: '10vw' },
            { field: 'time', headerName: 'Total Time (H:M:S)', width: '10vw'},
            { field: 'percent', headerName: 'Percentage (%)', width: '10vw'},
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
        <div style = {{height:'100vh',display:'flex', alignItems:'center',justifyContent:'center'}}>
          <div style = {{height:'50vh',width:'50vw',display:'flex', alignItems:'center',justifyContent:'center'}}>
            <Doughnut data={HRZoneData} />
          </div>
        </div>
        <div style = {{height:'100vh',display:'flex', alignItems:'center',justifyContent:'center'}}>
          <div style = {{height:'30vh',width:'30vw',display:'flex', alignItems:'center',justifyContent:'center'}}>
            <DataGrid className={classes.root} rows={HRRows} columns={HRColumns} pageSize={6} disableColumnMenu={true} disableColumnSelector={true} autoHeight={true} hideFooter={true} />      
          </div>
        </div>
        </div>
        </>
    )
}
export default HRZoneHistory