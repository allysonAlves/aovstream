import { Avatar, Card, Stack, TextField, Typography, ListItemAvatar, List, ListItem, ListItemText, Button } from '@mui/material'
import { makeStyles } from '@mui/styles';
import React, { createRef, useContext, useEffect, useState } from 'react'
import 'moment/dist/locale/pt-br'
import { dateToString, isLessTwoMinutesDiferences } from '../../../../../utils/date.utils';
import { ConnectionsContext } from '../../../../../context/ConnectionsProvider';


import MarkDown from '../../../../../components/markDown';
import { VideoStream } from '../../../../../components/VideoStream/VideoStream.jsx';

const useStyles = makeStyles((theme) => ({
  chatContainer: {    
    height: '100%',
    width: '100%',
    maxWidth: '100%',
    backgroundColor: '#292929'
  },  
  chatMessages: {
    paddingTop:15
  }, 
  message: {
    padding: '3px 10px 0 10px',
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
    maxWidth: '100%',
    padding: '0 15px 10px 15px',
    
  },  
}));

const Chat = () => {
  const {updateLocalStream, localStream, connections, messages, sendToChannel, currentChannel} = useContext(ConnectionsContext);
  const classes = useStyles();  

  const updateStream = () => {
    navigator.mediaDevices.getDisplayMedia({video:true}).then(stream => {
      updateLocalStream(stream);
    });
  }

  const handleSubmit = (target) => {
    if(!target.value) return;
    sendToChannel(target.value);      
    target.value = '';    
  }

  const onKeyDown = (e) => {
    const { value } = e.target;

    if (!e.shiftKey && e.key== 'Enter'){
      e.preventDefault();
      handleSubmit(e.target)
    }

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
      {/* <Stack 
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
      </Stack> */}
      <div style={{opacity:0, overflow:'hidden', width:0, height:0}}>
        {
          connections.map((connection, id) => (
              <VideoStream key={id} stream={connection.remoteStream}/>
          ))
        }
      </div>

      <List sx={{maxWidth: '100%', height: '100%', paddingTop:2, paddingRight:5, overflowY:'auto'}}>
        {
          messages.map((message, i) => (
            <ListItem key={i} alignItems="flex-start">
              <ListItemAvatar style={{minWidth:45}}>
                <Avatar alt={message?.user?.name} src={message?.user?.image} />
              </ListItemAvatar>
              <ListItemText
                className={classes.message}
                sx={{whiteSpace: 'pre-wrap', wordBreak: 'break-word', maxWidth: '1200px'}}
                primaryTypographyProps={{
                  gap:1, 
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '5px'
                }}                                
                primary={                  
                  <>
                    <Typography>
                      {message?.user?.name}
                    </Typography>
                    <Typography fontSize={13} component='span' color={'GrayText'}>
                      {dateToString(message?.date)}
                    </Typography>
                  </>
                }
                secondaryTypographyProps={{component: 'div'}}
                secondary={<MarkDown>{message.message}</MarkDown> }/>
            </ListItem>
          ))
        }
        </List> 

      <Stack alignItems='start' spacing={2} className={classes.chatInput} direction='row' id='messages-input'>
          <TextField 
            size='small' 
            onKeyDown={onKeyDown}            
            // onKeyUp={(event) => {              
            //   if (!event.shiftKey && event.key== 'Enter')
            //     handleSubmit(event.target)
            // }}
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