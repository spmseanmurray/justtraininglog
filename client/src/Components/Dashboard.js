import React from 'react';
import Grid from '@material-ui/core/Grid';
import ActivityList from './Activity/ActivityList';
import TrainingSelector from './Activity/TrainingSelector';

function Dashboard() {

    return (
    <div style={{backgroundColor:'lightgrey', zIndex:-1, height:'calc(100vh - 65px)'}}>
        <div style = {{height:'35',display:'flex', alignItems:'center',justifyContent:'center'}}></div>
        <div style={{flexGrow: 1,height:'calc(100vh - 125px)',overflowY:'hidden',overflowX:'hidden', margin:'20px'}}>
        <Grid container direction="row" justify="center" spacing={3}>
          <Grid item xs={4}>
            <ActivityList/>
          </Grid>

          <Grid item xs={6}>
            <TrainingSelector activityType='Run' duration={7} interval='day'/>
          </Grid>

        </Grid>
        </div>
     </div>
    );

    }

  export default Dashboard;