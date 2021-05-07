import React, {useEffect,} from 'react';
import axios from 'axios';
import { useLocation, useHistory } from 'react-router-dom'
import { auth_link } from '../../utils/common';
import {apiUpdateUser} from '../../utils/api';

function StravaRedirect() {
    const queryString = require('query-string');
    const location = useLocation();
    const history = useHistory();

    const authenticate = async () => {
        try {
            const parsed = queryString.parse(location.search);
            const stravaAuthToken = parsed.code;
            const response = await axios.post(`${auth_link}?client_id=${process.env.REACT_APP_CLIENT_ID}&client_secret=${process.env.REACT_APP_CLIENT_SECRET}&code=${stravaAuthToken}&grant_type=authorization_code`);
            const id = await sessionStorage.getItem('id');
            
            const payload = {
                stravaRefreshToken: response.data.refresh_token,
                stravaAuthToken: response.data.access_token,
                stravaAuthTokenExpiration: response.data.expires_at,
            };
            console.log(stravaAuthToken)
            console.log(response)
            console.log(id)
            console.log(payload)
            const res = await apiUpdateUser(id, payload)
            console.log(res)
        } catch (err) {console.log(err);}
    };

    useEffect(async () => {
        await authenticate();
    },[]);
    return (<div></div>)
}
export default StravaRedirect;