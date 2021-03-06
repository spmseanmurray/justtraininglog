import React, {useState, useEffect} from 'react';
import axios from 'axios';
import TrainingHistory from './TrainingHistory';
import {Button,} from 'reactstrap';
import IconButton from '@material-ui/core/IconButton';
import DirectionsRunIcon from '@material-ui/icons/DirectionsRun';
import PoolIcon from '@material-ui/icons/Pool';
import DirectionsBikeIcon from '@material-ui/icons/DirectionsBike';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import ArrowLeftIcon from '@material-ui/icons/ArrowLeft';
import AllInclusiveIcon from '@material-ui/icons/AllInclusive';

function TrainingSelector() {
const [activityType, setActivityType] = useState('Run');
const [index, setIndex] = useState(0);
const [interval, setInterval] = useState('Q');
const [activityData, setActivityData] = useState();

useEffect(async () => {
    const user = await axios.get(`${process.env.REACT_APP_API_URL}/api/user/${sessionStorage.getItem('id')}`)
    // Get database activity data
    setActivityData(await axios.get(`${process.env.REACT_APP_API_URL}/api/activity/strava/${user.data[0]._id}`));
},[])
return(
    <div style={{backgroundColor:'lightgrey', zIndex:-2,}}>
        <div style={{backgroundColor:'white', zIndex:-1, height:'48px', overflowY:'hidden',overflowX:'hidden', marginBottom:'20px'}}>
            <div>
                <div style={{display:'flex', flexDirection:'row', justifyContent:'space-between'}}>
                    <div>
                        <IconButton style={{color:interval==='Y'?'lightgrey':'purple'}} onClick={()=>{setIndex(index+1)}} disabled={interval==='Y'?true:false}>
                            <ArrowLeftIcon/>
                        </IconButton>
                        <Button style={{margin:'5px', minWidth: '40px', backgroundColor: interval==='W'? 'purple':'grey'}} onClick={()=>{setInterval('W'); setIndex(0)}}>W</Button>
                        <Button style={{margin:'5px', minWidth: '40px', backgroundColor: interval==='M'? 'purple':'grey'}} onClick={()=>{setInterval('M'); setIndex(0)}}>M</Button>
                        <Button style={{margin:'5px', minWidth: '40px', backgroundColor: interval==='Q'? 'purple':'grey'}} onClick={()=>{setInterval('Q'); setIndex(0)}}>Q</Button>
                        <Button style={{margin:'5px', minWidth: '40px', backgroundColor: interval==='Y'? 'purple':'grey'}} onClick={()=>{setInterval('Y'); setIndex(0)}}>Y</Button> 
                    </div>
                    <div>
                        <IconButton style={{color: activityType==='All'?'purple':'grey'}} onClick={()=>{setActivityType('All'); setIndex(0)}}>
                            <AllInclusiveIcon />
                        </IconButton>
                        <IconButton style={{color: activityType==='Run'?'purple':'grey'}} onClick={()=>{setActivityType('Run'); setIndex(0)}}>
                            <DirectionsRunIcon />
                        </IconButton>
                        <IconButton style={{color: activityType==='Ride'?'purple':'grey'}} onClick={()=>{setActivityType('Ride'); setIndex(0)}}>
                            <DirectionsBikeIcon />
                        </IconButton>
                        <IconButton style={{color: activityType==='Swim'?'purple':'grey'}} onClick={()=>{setActivityType('Swim'); setIndex(0)}}>
                            <PoolIcon />
                        </IconButton>
                        <IconButton onClick={()=>{setIndex(index-1)}} style={{color:index===0?'lightgrey':'purple'}} disabled={index===0?true:false}>
                            <ArrowRightIcon/>
                        </IconButton>
                    </div>
                </div>
            </div>
        </div>
        <div style={{backgroundColor:'white', zIndex:-1, height:'calc(25vh)', overflowY:'hidden',overflowX:'hidden', marginBottom:'20px'}}>
            <div style={{display:'flex',flexGrow: 1, flexDirection:'row', justifyContent:'center'}}>
                <TrainingHistory activityData={activityData} activityType={activityType} index={index} interval={interval} type={'distance'}/>
            </div>
        </div>
        <div style={{backgroundColor:'white', zIndex:-1, height:'calc(25vh)', overflowY:'hidden',overflowX:'hidden', marginBottom:'20px'}}>
            <div style={{display:'flex',flexGrow: 1, flexDirection:'row', justifyContent:'center'}}>
                <TrainingHistory activityData={activityData} activityType={activityType} index={index} interval={interval} type={'TSS'}/>
            </div>
        </div>
    </div> 
)

}
export default TrainingSelector