import React, {useState, useEffect} from 'react';
import TrainingHistory from './TrainingHistory';
import {Button,} from 'reactstrap';
import IconButton from '@material-ui/core/IconButton';
import DirectionsRunIcon from '@material-ui/icons/DirectionsRun';
import PoolIcon from '@material-ui/icons/Pool';
import DirectionsBikeIcon from '@material-ui/icons/DirectionsBike';

function TrainingSelector() {
const [activityType, setActivityType] = useState('Run');
const [duration, setDuration] = useState(7);
const [interval, setInterval] = useState('D');

return(
    <div>
        <div>
            <div>
                <Button style={{margin:'10px', color: interval==='D'?'white':'grey', backgroundColor:'purple',}} onClick={()=>{setInterval('D')}}>D</Button>
                <Button style={{margin:'10px', color: interval==='W'?'white':'grey', backgroundColor:'purple',}} onClick={()=>{setInterval('W')}}>W</Button>
                <Button style={{margin:'10px', color: interval==='M'?'white':'grey', backgroundColor:'purple',}} onClick={()=>{setInterval('M')}}>M</Button>
                <Button style={{margin:'10px', color: interval==='Y'?'white':'grey', backgroundColor:'purple',}} onClick={()=>{setInterval('Y')}}>Y</Button> 
            </div>
            <div>
                <IconButton style={{color: activityType==='Run'?'purple':'grey'}} onClick={()=>{setActivityType('Run')}}>
                    <DirectionsRunIcon />
                </IconButton>
                <IconButton style={{color: activityType==='Bike'?'purple':'grey'}} onClick={()=>{setActivityType('Bike')}}>
                    <DirectionsBikeIcon />
                </IconButton>
                <IconButton style={{color: activityType==='Swim'?'purple':'grey'}} onClick={()=>{setActivityType('Swim')}}>
                    <PoolIcon />
                </IconButton>
            </div>
        </div>
        <TrainingHistory activityType={activityType} duration={duration} interval={interval}/>
    </div>
)

}
export default TrainingSelector