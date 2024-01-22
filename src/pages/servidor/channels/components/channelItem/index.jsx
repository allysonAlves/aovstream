import React, { useState } from 'react' 
import { Stack, Typography } from '@mui/material'
import { makeStyles } from "@mui/styles";

import DuoIcon from '@mui/icons-material/Duo';
import UserItem from './userItem/UserItem';

const useStyles = makeStyles(() => ({
  usersContainer: {
    padding: '5px 30px 0 20px'
  },
  channelHeader: {
    alignItems: 'center', 
    borderRadius:5,    
    gap: '10px',
    display: 'flex',
    flexDirection: 'row',    
    '&:hover': {
        cursor:'pointer', 
        backgroundColor: '#404040'
    },    
  }

}));

const ChannelItem = ({onAccess}) => {

  const classes = useStyles();

  const [users, setUsers] = useState([]);  

  const addUser = () => {
    setUsers(previous => [...previous, {name: 'Allyson Alves', id: previous.length}])
    console.log(users);
  }

  return (
    <Typography component='div'>
      <Stack   
      direction='row'    
      onDoubleClick={addUser}      
      className={classes.channelHeader}>
          <Stack alignItems='center' component='div' fontSize='small' color='grey'>
            <DuoIcon/>            
          </Stack>
          <Typography fontSize='small' color='grey'>
            Daily - 9:15 AM
          </Typography>
      </Stack>
      <Stack className={classes.usersContainer}>
        {
          users.map(user => (
            <UserItem key={user.id} name={user.name}/>
          ))
        }
      </Stack>
    </Typography>
  )
}

export default ChannelItem