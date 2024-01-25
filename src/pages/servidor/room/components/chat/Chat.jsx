import { Avatar, Card, Stack, TextField, Typography, ListItemAvatar, List, ListItem, ListItemText, Button } from '@mui/material'
import { makeStyles } from '@mui/styles';
import React, { createRef, useContext, useEffect, useState } from 'react'
import 'moment/dist/locale/pt-br'
import { dateToString, isLessTwoMinutesDiferences } from '../../../../../utils/date.utils';
import { ConnectionsContext, StreamVideo } from '../../../../../context/ConnectionsProvider';


import MarkDown from '../../../../../components/markDown';

const useStyles = makeStyles((theme) => ({
  chatContainer: {    
    height: '100%',
    width: '100%',
    backgroundColor: '#303030'
  },  
  chatMessages: {
   paddingTop:15
  }, 
  message: {
    padding: '3px 20px 3px 20px',
    '&:hover': {
      backgroundColor: '#00000010'
    }
  }, 
  message_sequence: {
    padding: '0 20px 5px 76px',
    '&:hover': {
      backgroundColor: '#00000010'
    }
  }, 
  chatInput: {
    padding: 10
  },  
}));

const Chat = () => {
  const {updateLocalStream,localStream, connections, messages, sendToChannel, currentChannel} = useContext(ConnectionsContext);
  const classes = useStyles();  

  const updateStream = () => {
    navigator.mediaDevices.getDisplayMedia({video:true}).then(stream => {
      updateLocalStream(stream);
    });
  }

  const handleSubmit = (target) => {
    sendToChannel(target.value);      
    target.value = '';    
  }

  const onKeyDown = (e) => {
    const { value } = e.target;

    if (e.key === 'Tab') {
      e.preventDefault();

      const cursorPosition = e.target.selectionStart;
      const cursorEndPosition = e.target.selectionEnd;
      const tab = '\t';

      e.target.value =
        value.substring(0, cursorPosition) +
        tab +
        value.substring(cursorEndPosition);

      e.target.selectionStart = cursorPosition + 1;
      e.target.selectionEnd = cursorPosition + 1;
    }
  }

  const isSequenceMessage = (index, list) => {
    if(index === 0) return false;

    if(
      list[index - 1].user.id == list[index].user.id && 
      isLessTwoMinutesDiferences(list[index].date, list[index - 1].date)
      ) 
      return true;
  }

  if(!currentChannel) return null;
  
  
  return (
    <Stack justifyContent='space-between' className={classes.chatContainer} id='chat'>
      <Card elevation={3} sx={{padding:2}}>
        {currentChannel.name}
        <Button 
        sx={{marginLeft:2}}
        onClick={updateStream}
        variant='contained' 
        color='error'>
          Stream
        </Button>
      </Card>

      <Stack 
      direction='row' 
      spacing={1} 
      alignItems='center' 
      height={'50%'} 
      style={{backgroundColor:'black'}}  
      id='video-stream-container'>        
        <StreamVideo key='localvideo' stream={localStream}/>       
        {
          connections.map((connection, id) => (
              <StreamVideo key={id} stream={connection.remoteStream}/>
          ))
        }
      </Stack>

      <List sx={{ height: '100%', paddingTop:2, overflowY:'auto'}}>
        {
          messages.map((message, i) => (
            <ListItem key={i} alignItems="flex-start">
              <ListItemAvatar>
                <Avatar alt={message?.user?.name} src={message?.user?.image} />
              </ListItemAvatar>
              <ListItemText
                className={classes.message}
                sx={{whiteSpace: 'pre-wrap'}}
                primary={`${message?.user?.name} - ${dateToString(message?.date) || ''}`}
                secondaryTypographyProps={{component: 'div'}}
                secondary={
                  <MarkDown>{message.message}</MarkDown>                
                }/>
            </ListItem>
          ))
        }
        </List>    
      

     

      <Stack spacing={2} className={classes.chatInput} direction='row' id='messages-input'>
          <TextField   
            //value={message}
            onKeyDown={onKeyDown}
            //onChange={handleChange} 
            onKeyUp={(event) => {              
              if (!event.shiftKey && event.key== 'Enter')
                handleSubmit(event.target)
            }}
            id="outlined-multiline-flexible"    
            placeholder='Digite sua mensagem'        
            multiline
            fullWidth={true}
            maxRows={10}
          />         
      </Stack>
    </Stack>
  )
}

export default Chat