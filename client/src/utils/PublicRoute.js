import React from 'react';
import { Route} from 'react-router-dom';
import Header from '../Components/Header';

const PublicRoute = ({ component: Component , ...path})=>{
    return (
        <Route {...path}  component={(props)=>(
            <div>
                <Header />
                <Component {...props} />
            </div>
        )}
        />
    )
};

export default PublicRoute;