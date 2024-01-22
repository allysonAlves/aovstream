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
  const {updateLocalStream, connections, messages, createCall, createAnswer, registerAnswer, sendToChannel} = useContext(ConnectionsContext);
  const classes = useStyles();
  const [message, setMessage] = useState('');   
  const videoMainRef = createRef(null);

  useEffect(() => {    
    
    return () => {
     
    }
  }, [connections]) 

  const updateStream = () => {
    navigator.mediaDevices.getDisplayMedia({video:true}).then(stream => {
      updateLocalStream(stream);
    });
  }
  
  console.log(window.screenY)
  
  const handleSubmit = (event) => {
    sendToChannel(message);      
    setMessage('');      
  }

  const handleChange = (event) => {
    setMessage(event.target.value);   
  }

  const isSequenceMessage = (index, list) => {
    if(index === 0) return false;

    if(
      list[index - 1].user.id == list[index].user.id && 
      isLessTwoMinutesDiferences(list[index].date, list[index - 1].date)
      ) 
      return true;
  }
  const call = () => {
    createCall();
  }

  const answer = () => {
    console.log('create answer',message)
    createAnswer(message);
    setMessage('');
  }

  const connect = () => {
    registerAnswer(message)
    setMessage('');
  }
  
  
  return (
    <Stack justifyContent='space-between' className={classes.chatContainer} id='chat'>
      <Card elevation={3} sx={{padding:2}}>
        {'Teste'}
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
      style={{backgroundColor:'black', display: 'none'}}  
      id='video-stream-container'>        
        <video        
        controls       
        ref={videoMainRef}    
        autoPlay        
        style={{objectFit: 'scale-down'}} 
        width={320} 
        height={180}></video>        
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
      
      

      {/* <Stack 
      flex={1}       
      className={classes.chatMessages} id='messages'>
        {
          messageList.map((message, index) => (
            <>
              {
                !isSequenceMessage(index, messageList) ? (
                  <Stack 
                  key={message.id}                
                  className={classes.message}                 
                  spacing={2} 
                  direction='row'>                                    
                    <Avatar/> 
                    <Stack color='lightgray'> 
                      <Typography color='gray'>
                        {message.user.name} - {dateToString(message.date)}
                      </Typography>                     
                      <Typography>
                        {message.message}                      
                      </Typography>                     
                    </Stack>
                  </Stack>   
                ) : (                                     
                  <Stack 
                  key={message.id} 
                  className={classes.message_sequence} 
                  color='lightgray'>
                    {message.message}
                  </Stack>                
                )                
              }
            </>

          ))
        }
      </Stack> */}

      <Stack spacing={2} className={classes.chatInput} direction='row' id='messages-input'>        
          <TextField   
            value={message}
            onChange={handleChange} 
            onKeyUp={(event) => {              
              if (!event.shiftKey && event.key== 'Enter')
                handleSubmit()
            }}
            id="outlined-multiline-flexible"    
            placeholder='Digite sua mensagem'        
            multiline
            fullWidth={true}
            maxRows={10}
          /> 
          <Button onClick={call} variant='contained' color='success' size='small'>Call</Button>     
          <Button onClick={answer} variant='contained' color='warning' size='small'>Answer</Button>     
          <Button onClick={connect} variant='contained' color='secondary' size='small'>Connect</Button>     
      </Stack>
    </Stack>
  )
}

export default Chat