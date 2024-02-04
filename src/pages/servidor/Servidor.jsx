import React, { useState } from 'react';
import {makeStyles} from '@mui/styles';
import Channels from './channels/Channels';
import Room from './room/Room';
import { Box, Drawer, IconButton, SwipeableDrawer } from '@mui/material';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';

const useStyles = makeStyles(theme => ({
    container:{
      width: '100%',
      maxWidth: '100vw',
      height: '100vh',
      display: 'flex',
      overflow: 'hidden',
    },
    channelContainer: {
      [theme.breakpoints.down("md")]: {
        display: "none",
      },
    },
    iconMenuOpen: {    
      position: 'absolute', 
      zIndex:100, 
      top:100, 
      left:0,
      display: 'none',
      [theme.breakpoints.down("md")]: {
        display: "block",
      },
    },
    drawerMenu: {

    }
}));

const Servidor = () => {
    const classes = useStyles();
    const [menuOpen, setMenuOpen] = useState(false);
    
  return (
    <section className={classes.container} spacing={0}> 
      <Box className={classes.channelContainer}>
        <Channels/>      
      </Box>
      <Box className={classes.iconMenuOpen}>
        <IconButton onClick={() => setMenuOpen(true)}>
          <ArrowRightIcon/>
        </IconButton>
      </Box>
      <Drawer open={menuOpen} onClose={() => setMenuOpen(false)}>
        <Channels/> 
      </Drawer>
      <Room/> 
    </section>
  )
}

export default Servidor