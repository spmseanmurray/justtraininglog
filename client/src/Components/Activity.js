import React, {useState, useEffect} from 'react';
import { useParams } from "react-router";
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { DataGrid } from '@material-ui/data-grid';
import {fancyTimeFormat} from '../utils/common'
import DirectionsRunIcon from '@material-ui/icons/DirectionsRun';
import PoolIcon from '@material-ui/icons/Pool';
import DirectionsBikeIcon from '@material-ui/icons/DirectionsBike';

function Activity() {
    let id = useParams();
    const [data, setData] = useState([]);
    const [activityRows, setActivityRows] = useState([]);
    const [activityColumns, setActivityColumns] = useState([]);

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales:{
            x: {
                grid: {display: false},
                title: {display: true, text: 'Time [H:M:S]'}
            },
            y: {
                display: false,
            },
            y1: {
                display: 'auto',
                grid: {display: false},
                title: {display: true, text: 'Heartrate [bpm]'}
            },
            y2: {
                display: 'auto',
                reverse: true,
                max: 15,
                grid: {display: false},
                title: {display: true, text: 'Pace [min/km]'}
            }
        },
      };
      
    useEffect(async () => {
        // Get database activity data
        const activityData = await axios.get(`${process.env.REACT_APP_API_URL}/api/activity/${id.id}`);
        // Set chart data and colors
        setData({
            labels: activityData.data[0].timeStream.map(ele => fancyTimeFormat(ele)),
            datasets: [
            {
                label: 'Heart Rate [bpm]',
                data: activityData.data[0].heartrateStream,
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgba(255, 99, 132, 1)',
                yAxisID: 'y1',
                pointRadius: 0,
            },
            {
                label: 'Pace [min/km]',
                data: activityData.data[0].paceStream,
                backgroundColor: 'rgb(54, 162, 235)',
                borderColor: 'rgba(54, 162, 235, 1)',
                yAxisID: 'y2',
                pointRadius: 0,
            },
        ]
        });
        setActivityColumns([
            { field: 'activityType', headerName: 'Type', renderCell: (params) => params.value.includes('Swim') ? <PoolIcon/> : params.value.includes('Run') ? <DirectionsRunIcon/> : <DirectionsBikeIcon/>, flex: 0.075, },
            { field: 'date', headerName: 'Date', flex: 0.1},
            { field: 'name', headerName: 'Name', flex: 0.25},
            { field: 'distance', headerName: 'Distance (km)', flex: 0.1, },
            { field: 'duration', headerName: 'Total Time (H:M:S)', flex: 0.15,},
            ]);
        setActivityRows([{
            activityType: activityData.data[0].activityType,
            date: activityData.data[0].activityDate,
            name: activityData.data[0].activityName,
            distance: activityData.data[0].activityDistance, 
            duration: activityData.data[0].activityTime,
            id: activityData.data[0]._id,
        }]);
    },[]);

    return(
        <div>
        <div style = {{height:'5vh',display:'flex', alignItems:'center',justifyContent:'center'}}></div>
        <div style = {{height:'10vh',display:'flex', alignItems:'center',justifyContent:'center'}}>
            <div style = {{height:'10vh',width:'80vw',display:'flex', alignItems:'center',justifyContent:'center'}}>
                <DataGrid rows={activityRows} columns={activityColumns} density={'compact'} disableColumnMenu={true} disableColumnSelector={true} autoHeight={true} hideFooter={true}/>
            </div>
        </div>
        <div style = {{height:'2vh',display:'flex', alignItems:'center',justifyContent:'center'}}></div>
        <div style = {{height:'70vh',display:'flex', alignItems:'center',justifyContent:'center'}}>
            <div style = {{height:'70vh',width:'80vw',display:'flex', alignItems:'center',justifyContent:'center'}}>
                <Line data={data} options={options}/>
            </div>
        </div>
        </div>
    )
}

export default Activity