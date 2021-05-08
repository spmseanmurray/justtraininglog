import React from 'react';

function StravaAuth() {
    const scope = 'read,activity:read_all';
    const handleLogin = () => {
        window.location = `http://www.strava.com/oauth/authorize?client_id=64006&response_type=code&redirect_uri=${process.env.REACT_APP_URL}/strava-redirect&approval_prompt=force&scope=${scope}`;
    };

    return (
        <div> {handleLogin()} </div>
    )
}
export default StravaAuth;