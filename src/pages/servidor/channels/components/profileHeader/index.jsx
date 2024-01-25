import { AppBar, Avatar, Card, Paper, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles';
import React, { useContext } from 'react'
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { AuthContext } from '../../../../../context/AuthProvider';

const useStyles = makeStyles((theme) => ({    
    profileStack: {
      padding: "10px 15px 5px 10px",
      display: "flex",
      alignItems: "end",   
      gap: 10,   
    },
  }));

const ProfileHeader = () => {
  const {user} = useContext(AuthContext);
    const classes = useStyles();
  return (
    <Card elevation={5} className={classes.profileStack}>
        <Avatar variant="rounded"></Avatar>
        <Typography noWrap style={{flex:1}}>{user.name}</Typography>
        <KeyboardArrowDownIcon
          fontSize="small"
          sx={{ cursor: "pointer", ":hover": { opacity: 0.5 } }}
        />
    </Card>
  )
}

export default ProfileHeader