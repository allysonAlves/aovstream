import React from 'react';
import {makeStyles} from '@mui/styles';
import Channels from './channels/Channels';
import Room from './room/Room';

const useStyles = makeStyles(theme => ({
    container:{
      width: '100%',
      maxWidth: '100vw',
      height: '100vh',
      display: 'flex',
      overflow: 'hidden',
    }
}));

const Servidor = () => {
    const classes = useStyles();
  return (
    <section className={classes.container} spacing={0}> 
      <Channels/>      
      <Room/> 
    </section>
  )
}

export default Servidor