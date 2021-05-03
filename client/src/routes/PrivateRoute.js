import React from 'react';
import {Route, Redirect} from 'react-router-dom';
import Header from '../Components/Header';
import {getLoginStatus} from '../utils/common'

const PublicRoute = ({ component: Component , ...path})=>{
    return (
        <Route {...path}  component={(props)=> {
            if (getLoginStatus()){
                return(
                    <div>
                        <Header />
                        <Component {...props} />
                </div>)}
            else {
                return <Redirect to="/login" />
        }}}
        />
    )
};

export default PublicRoute;