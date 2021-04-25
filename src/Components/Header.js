import React, {useState} from 'react';
import AppBar from '@material-ui/core/AppBar';
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

    return(
        <div style={{flexGrow: 1}}>
        <AppBar position="static" style={{ background: "#002D72",height:'65px'}}>
            <Toolbar>
            <IconButton edge="start" style={{ background: "#002D72" }}
                onClick={() => {
                    setIsOpenDrawer(true);
                }}>
            <MenuIcon style={{ color: "#FFFFFF" }}/>
          </IconButton>
            <Typography variant="h6" style={{flexGrow: 1,textAlign: "left"}}>
                JuStTrain
            </Typography>
            </Toolbar>
        </AppBar>
        <Drawer anchor={"left"} open={isOpenDrawer} onClose={()=>setIsOpenDrawer(false)} >
        <Box minWidth={"15vw"} bgcolor={'#fff'}>
        <List >
          <ListItem >
            <ListItemIcon><DashboardIcon style={{ color: "#778899" }}/></ListItemIcon>
            <ListItemText primary={"Dashboard"} />
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