import { Paper } from '@mui/material';
import { makeStyles } from '@mui/styles';
import React, { useContext } from 'react'
import Chat from './components/chat/Chat';
import ConnectionsProvider, { ConnectionsContext } from '../../../context/ConnectionsProvider';

const useStyles = makeStyles(theme => ({
    container:{
        flex: 1,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#303030',       
    }
}));

const Room = () => {
    const classes = useStyles();
    const {currentChannel} = useContext(ConnectionsContext);

  return (    
    <Paper elevation={5} className={classes.container}>
        <Chat/>
    </Paper>    
  )
}

export default Room