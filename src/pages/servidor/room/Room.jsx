import { Paper } from '@mui/material';
import { makeStyles } from '@mui/styles';
import React, { useContext } from 'react'
import Chat from './components/chat/Chat';
import ConnectionsProvider, { ConnectionsContext } from '../../../context/ConnectionsProvider';

const useStyles = makeStyles(theme => ({
    container:{
      flex: 1,
      maxWidth: 'calc(100% - 250px)', 
      minWidth:'450px',     
      backgroundColor: 'red',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',              
    }
}));

const Room = () => {
    const classes = useStyles();
  return (    
    <Paper elevation={5} className={classes.container}>
        <Chat/>
    </Paper>    
  )
}

export default Room