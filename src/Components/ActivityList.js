import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { DataGrid } from '@material-ui/data-grid';
import { useHistory } from "react-router-dom";
import {fancyTimeFormat} from '../utils/common'
import DirectionsRunIcon from '@material-ui/icons/DirectionsRun';
import PoolIcon from '@material-ui/icons/Pool';
import DirectionsBikeIcon from '@material-ui/icons/DirectionsBike';

function ActivityList() {
  const [activityRows, setActivityRows] = useState([]);
  const [activityColumns, setActivityColumns] = useState([]);
  const history = useHistory();

  useEffect(async () => {
    // Get database activity data
    const activityData = await axios.get(`${process.env.REACT_APP_API_URL}/api/activity/`);
    console.log(activityData);
    // Set chart data and colors
    setActivityColumns([
        { field: 'activityType', headerName: 'Type', renderCell: (params) => params.value.includes('Swim') ? <PoolIcon/> : params.value.includes('Run') ? <DirectionsRunIcon/> : <DirectionsBikeIcon/>, flex: 0.075, },
        { field: 'date', headerName: 'Date', flex: 0.1},
        { field: 'name', headerName: 'Name', flex: 0.25},
        { field: 'distance', headerName: 'Distance (km)', flex: 0.1, },
        { field: 'duration', headerName: 'Total Time (H:M:S)', flex: 0.15,},
        ]);
    setActivityRows(activityData.data.map(ele=> {return {  
        activityType: ele.activityType,
        date: new Date(ele.activityDate).toISOString().slice(0,10),
        name: ele.activityName,
        distance: (Math.round((ele.activityDistance/1000 + Number.EPSILON) * 100) / 100), 
        duration: fancyTimeFormat(ele.activityTime),
        id: ele._id,
    }}));
  }, []);

  return (
    <div>
    <div style = {{height:'5vh',display:'flex', alignItems:'center',justifyContent:'center'}}></div>
    <div style = {{height:'80vh',display:'flex', alignItems:'center',justifyContent:'center'}}>
      <div style = {{height:'80vh',width:'90vw',display:'flex', alignItems:'center',justifyContent:'center'}}>
          <DataGrid rows={activityRows} columns={activityColumns} onCellDoubleClick={(params)=>history.push(`/activity/${params.id}`)} sortModel={[{field: 'date', sort: 'desc',}]} scrollbarSize={17}/>
      </div>
    </div>
    </div>
  )
}
export default ActivityList