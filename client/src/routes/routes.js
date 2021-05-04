import React from 'react';
import {Switch} from 'react-router-dom';
import Activity from '../Components/Activity';
import ActivityList from '../Components/ActivityList';
import ActivityHistroy from '../Components/ActivityHistory';
import HRZoneHistroy from '../Components/HRZoneHistory';
import Home from '../Components/Home';
import Register from '../Components/Authentication/Register';
import Login from '../Components/Authentication/Login';
import VerifyAccount from '../Components/Authentication/VerifyAccount';
import PublicRoute from './PublicRoute';
import PrivateRoute from './PrivateRoute';

const Routes = () => (
    <Switch>
        <PublicRoute exact path="/register" component={Register} />
        <PublicRoute exact path="/login" component={Login} />
        <PrivateRoute exact path="/verify" component={VerifyAccount} />
        <PrivateRoute exact path="/home" component={Home} />
        <PrivateRoute exact path="/activity/:id" component={Activity} />
        <PrivateRoute exact path="/activity-list" component={ActivityList} />
        <PrivateRoute exact path="/activity-history" component={ActivityHistroy} />
        <PrivateRoute exact path="/hr-zone-history" component={HRZoneHistroy} />
    </Switch>
)

export default Routes;