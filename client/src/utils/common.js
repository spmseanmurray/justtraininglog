// Strava API 
export const auth_link = "https://www.strava.com/oauth/token";
export const activities_link = `https://www.strava.com/api/v3/athlete/activities`;
export const streams_link = `https://www.strava.com/api/v3/activities/`;
require("dotenv").config();

// Heart Rate Zones
export const HRZones = [116, 142, 158, 169, 178, 205];
export const HRZoneLabels = ['Zone 0','Zone 1','Zone 2','Zone 3','Zone 4','Zone 5',];

// Get array of date object for each day between start and end day
export const getDaysArray = function(start, end) {
    for(var arr=[],dt=new Date(start); dt<=end; dt.setDate(dt.getDate()+1)){
        arr.push(new Date(dt));
    }
    return arr;
};

export function fancyTimeFormat(duration)
{   
    // Hours, minutes and seconds
    var hrs = ~~(duration / 3600);
    var mins = ~~((duration % 3600) / 60);
    var secs = ~~duration % 60;

    // Output like "1:01" or "4:03:59" or "123:03:59"
    var ret = "";

    if (hrs > 0) {
        ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
    }

    ret += "" + mins + ":" + (secs < 10 ? "0" : "");
    ret += "" + secs;
    return ret;
}

export function getTimePerZone(activityData){
    const timeDelta = activityData.data.time.data.map(ele => ele-activityData.data.time.data[activityData.data.time.data.indexOf(ele)-1]); 
    timeDelta[0] = 0; 
    const timePerHRZone = new Array(HRZones.length).fill(0);
    for(var i = 0; i < HRZones.length; i++){
        for (var j = 0; j < timeDelta.length; j++) {
            if (i===0 && activityData.data.heartrate.data[j] < HRZones[i]) {
                timePerHRZone[i] += timeDelta[j];
            }
            else if (i>0 && activityData.data.heartrate.data[j] >= HRZones[i-1] && activityData.data.heartrate.data[j] < HRZones[i] ){
                timePerHRZone[i] += timeDelta[j];
            }
        }
    }
    return timePerHRZone;
}

export function logout() {
    sessionStorage.removeItem('id');
};

export function login (id){
    sessionStorage.setItem('id', id);
};

export function capitalizeFirst(s){
    return s.charAt(0).toUpperCase()+s.slice(1).toLowerCase()
};