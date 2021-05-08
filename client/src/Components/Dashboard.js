import React from 'react';
import Grid from '@material-ui/core/Grid';
import ActivityList from './Activity/ActivityList';

function Dashboard() {
    return (
    <div>
        <div style = {{height:'35',display:'flex', alignItems:'center',justifyContent:'center'}}></div>
        <Grid container direction="row" justify="center" spacing={3}>
          <Grid item xs={4}>
            <ActivityList/>
          </Grid>
          
        </Grid>
        </div>
    );

    }

  export default Dashboard;