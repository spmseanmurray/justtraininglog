import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { DataGrid } from '@material-ui/data-grid';
import { useHistory } from "react-router-dom";
import DirectionsRunIcon from '@material-ui/icons/DirectionsRun';
import PoolIcon from '@material-ui/icons/Pool';
import DirectionsBikeIcon from '@material-ui/icons/DirectionsBike';

function ActivityList() {
  const [activityRows, setActivityRows] = useState([]);
  const [activityColumns, setActivityColumns] = useState([]);
  const history = useHistory();

  useEffect(async () => {
    const user = await axios.get(`${process.env.REACT_APP_API_URL}/api/user/${sessionStorage.getItem('id')}`);
    // Get database activity data
    const activityData = await axios.get(`${process.env.REACT_APP_API_URL}/api/activity/strava/${user.data[0]._id}`);
    // Set chart data and colors
    setActivityColumns([
        { field: 'activityType', headerName: 'Type', renderCell: (params) => params.value.includes('Swim') ? <PoolIcon/> : params.value.includes('Run') ? <DirectionsRunIcon/> : <DirectionsBikeIcon/>, flex: 0.125, },
        { field: 'date', headerName: 'Date', flex: 0.2},
        { field: 'distance', headerName: 'Distance (km)', flex: 0.2},
        { field: 'pace', headerName: 'Pace (min/km)', flex: 0.2},
        { field: 'duration', headerName: 'Time', flex: 0.15},
        ]);
    setActivityRows(activityData.data.map(ele=> {return {  
        activityType: ele.activityType,
        date: ele.activityDate,
        distance: ele.activityDistance, 
        pace: ele.averagePace,
        duration: ele.activityTime,
        id: ele._id,
    }}));
  }, []);

  return (
    <div>
    <div style = {{height:'80vh',display:'flex', alignItems:'center',justifyContent:'center'}}>
      <div style = {{height:'80vh',width:'90vw',display:'flex', alignItems:'center',justifyContent:'center'}}>
          <DataGrid rows={activityRows} columns={activityColumns} disableColumnMenu={true} onCellDoubleClick={(params)=>history.push(`/activity/${params.id}`)} sortModel={[{field: 'date', sort: 'desc',}]} scrollbarSize={17}/>
      </div>
    </div>
    </div>
  )
}
export default ActivityList;