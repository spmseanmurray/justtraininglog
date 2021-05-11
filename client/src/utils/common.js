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
    for(var arr=[],d=new Date(start); d<=end; d.setDate(d.getDate()+1)){
        arr.push(new Date(d));
    }
    return arr;
};
export const getWeeksArray = function(start, end) {
    for(var arr=[],d=new Date(start); d<=end; d.setDate(d.getDate()+1)){
        arr.push(d.getWeek());
    }
    return [...new Set(arr)];
};
export const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
export const getMonthsArray = function(end) {
    for (var i = 0, arr = [], month = new Date(end).getMonth()+1; i < 12; i++) {
        arr.push(monthNames[month]);
        month++;
        month>11?month=0:month=month;
    }
    return arr;
};

// Returns the ISO week of the date.
Date.prototype.getWeek = function() {
    var date = new Date(this.getTime());
    date.setHours(0, 0, 0, 0);
    // Thursday in current week decides the year.
    date.setDate(date.getDate() + 3 - (date.getDay() + 7) % 7);
    // January 4 is always in week 1.
    var week1 = new Date(date.getFullYear(), 0, 4);
    // Adjust to Thursday in week 1 and count number of weeks from date to week1.
    return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
  }

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