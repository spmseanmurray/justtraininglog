import React from 'react';
import {Switch} from 'react-router-dom';
import Activity from '../Components/Activity';
import ActivityList from '../Components/ActivityList';
import ActivityHistroy from '../Components/ActivityHistory';
import HRZoneHistroy from '../Components/HRZoneHistory';
import Home from '../Components/Home';
import Register from '../Components/Authentication/Register';
import PublicRoute from './PublicRoute';

const Routes = () => (
    <Switch>
        <PublicRoute exact path="/" component={Home} />
        <PublicRoute exact path="/register" component={Register} />
        <PublicRoute exact path="/activity/:id" component={Activity} />
        <PublicRoute exact path="/activity-list" component={ActivityList} />
        <PublicRoute exact path="/activity-history" component={ActivityHistroy} />
        <PublicRoute exact path="/hr-zone-history" component={HRZoneHistroy} />
    </Switch>
)

export default Routes;