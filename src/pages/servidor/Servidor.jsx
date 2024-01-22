import React from 'react';
import {makeStyles} from '@mui/styles';
import Channels from './channels/Channels';
import Room from './room/Room';

const useStyles = makeStyles(theme => ({
    container:{
      width: '100vw',
      height: '100vh',
      display: 'flex',       
    }
}));

const Servidor = () => {
    const classes = useStyles();
  return (
    <div className={classes.container}>
        <Channels/>
        <Room/>
    </div>
  )
}

export default Servidor