import React from 'react'
import { Avatar, Stack, Typography } from '@mui/material'
import { makeStyles } from "@mui/styles"; 

import KeyboardVoiceIcon from '@mui/icons-material/KeyboardVoice';
import MicOffIcon from '@mui/icons-material/MicOff';

const useStyles = makeStyles(() => ({
    container: {
        padding: '5px',
        borderRadius: '5px',
        '&:hover': {
            cursor:'pointer', 
            backgroundColor: '#404040'
        },
    },    
  }));


const UserItem = ({name}) => {
    const classes = useStyles();
  return (
    <Stack 
    className={classes.container} 
    direction='row' 
    alignItems='center'
    spacing={1} 
    color='whitesmoke'>
        {/* <Avatar sx={{height:20, width:20}}/> */}
        <KeyboardVoiceIcon fontSize='small' color='success'/>
        <Typography fontSize='small'>
            {name}
        </Typography>
    </Stack>
  )
}

export default UserItem