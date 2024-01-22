import { AppBar, Avatar, Card, Paper } from '@mui/material'
import { makeStyles } from '@mui/styles';
import React from 'react'

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const useStyles = makeStyles((theme) => ({    
    profileStack: {
      padding: "10px 15px 5px 10px",
      display: "flex",
      alignItems: "end",   
      gap: 10,   
    },
  }));

const ProfileHeader = () => {
    const classes = useStyles();
  return (
    <Card elevation={5} className={classes.profileStack}>
        <Avatar variant="rounded">A</Avatar>
        <span style={{flex:1}}>Allyson Vieira</span>
        <KeyboardArrowDownIcon
          fontSize="small"
          sx={{ cursor: "pointer", ":hover": { opacity: 0.5 } }}
        />
    </Card>
  )
}

export default ProfileHeader