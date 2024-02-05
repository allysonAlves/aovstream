import { Paper } from '@mui/material';
import { makeStyles } from '@mui/styles';
import React, { useContext } from 'react'
import Chat from './components/chat/Chat';
import ConnectionsProvider, { ConnectionsContext } from '../../../context/ConnectionsProvider';

const useStyles = makeStyles(theme => ({
    container:{
      flex: 1, 
      backgroundColor: 'red',     
      display: 'flex',
      flexDirection: 'column',                 
    }
}));

const Room = () => {
    const classes = useStyles();
  return (<Chat/>)
}

export default Room