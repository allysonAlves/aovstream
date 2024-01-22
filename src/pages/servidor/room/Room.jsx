import { Paper } from '@mui/material';
import { makeStyles } from '@mui/styles';
import React from 'react'
import Chat from './components/chat/Chat';
import ConnectionsProvider from '../../../context/ConnectionsProvider';

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

  return (
    <ConnectionsProvider>
      <Paper elevation={5} className={classes.container}>
          <Chat channelName='Daily - 9:15 AM'/>
      </Paper>
    </ConnectionsProvider>
  )
}

export default Room