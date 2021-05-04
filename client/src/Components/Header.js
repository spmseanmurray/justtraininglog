import React, {useState} from 'react';
import { useHistory } from "react-router-dom";
import {logout} from '../utils/common';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';
import Drawer from '@material-ui/core/Drawer';
import Box from '@material-ui/core/Box';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import DashboardIcon from '@material-ui/icons/Dashboard';
import ImportContactsIcon from '@material-ui/icons/ImportContacts';

function Header(){
    const [isOpenDrawer, setIsOpenDrawer] = useState(false);
    const history = useHistory();
    
    return(
        <div style={{flexGrow: 1}}>
        <AppBar position="static" style={{ background: "#002D72",height:'37'}}>
            <Toolbar>
            <IconButton edge="start" style={{ background: "#002D72" }} onClick={() => {setIsOpenDrawer(true);}}>
            <MenuIcon style={{ color: "#FFFFFF" }}/>
          </IconButton>
            <Typography variant="h6" style={{flexGrow: 1,textAlign: "left"}}>
                Just Training Log
            </Typography>
            <Button style={{color: 'white', textAlign: "right", cursor:'pointer'}} onClick={()=>{logout(); history.push('/login')}} hidden={!sessionStorage.getItem('id')}>
                LOGOUT
            </Button>
            </Toolbar>
        </AppBar>
        <Drawer anchor={"left"} open={isOpenDrawer} onClose={()=>setIsOpenDrawer(false)} >
        <Box minWidth={"15vw"} bgcolor={'#fff'}>
        <List >
          <ListItem button onClick={()=>history.push('/')}>
            <ListItemIcon><DashboardIcon style={{ color: "#778899" }}/></ListItemIcon>
            <ListItemText primary={"Home"} />
          </ListItem>
      </List>
      <Divider/>
      <List>
        <ListItem>
            <ListItemIcon><ImportContactsIcon style={{ color: "#778899" }}/></ListItemIcon>
            <ListItemText primary={"Contact Us"} />
        </ListItem>
      </List>
      </Box>
      </Drawer>
        </div>
    )
}
export default Header