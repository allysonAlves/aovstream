import React, { useEffect, useState } from 'react'
import useRecorder from '../../hooks/useRecorder'
import { getMediaExtensionByType } from '../../utils/mediaRecorder.utils';
import { Button, Dialog, DialogActions, DialogContent, IconButton, MenuItem, Select, Stack, TextField, Typography } from '@mui/material';
import moment from 'moment';
import { PiRecordFill, PiStopFill } from 'react-icons/pi';

const AOVRecorder = () => {
    const [isOpen, setIsOpen] = useState(false);
    const {
        start,         
        stop,
        configureMedia, 
        configureStream, 
        mediaOptions,
        streamOptions ,
        recordingTime , 
        isRecording, 
        blob, 
        blobUrl, 
        mediaSuported,
        
    } = useRecorder();

    useEffect(() => {
        if(blobUrl){

        }
    },[blobUrl])

    const download = (fileName) => {        
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = `${fileName || 'aov-new-video'}.${getMediaExtensionByType(mediaOptions.videoType)}`;
        a.click();
       // URL.revokeObjectURL(blobUrl);
    }

    const openInNewTab = () => {
        if(blobUrl)
            window.open(blobUrl);
    }    

    const RenderTimer = () => {
        const currentTime = moment('00:00:00', 'HH:mm:ss').add(recordingTime, 'seconds');
        return (
            <Typography color='lightgray'>
            {
                currentTime.hours() > 0 ? currentTime.format('HH:mm:ss') :  currentTime.format('mm:ss')  
            }
            </Typography>
        )
    }

  return (
    <>
        <Dialog fullWidth open={isOpen}>
            <DialogContent>
              
              <Select onChange={(ev) => configureMedia({videoType: ev.target.value})} size='small' value={mediaOptions.videoType}>
                {
                  mediaSuported.videoTypes.map(videoType => (
                    <MenuItem key={videoType} value={videoType}>{videoType}</MenuItem>
                  ))
                }
              </Select>

              <Select onChange={(ev) => configureMedia({videoCodec: ev.target.value})} size='small' value={mediaOptions.videoCodec}>
                {
                  mediaSuported.videoCodecs.map(videoCodec => (
                    <MenuItem key={videoCodec} value={videoCodec}>{videoCodec}</MenuItem>
                  ))
                }
              </Select>

              <Select onChange={(ev) => configureMedia({audioCodec: ev.target.value})} size='small' value={mediaOptions.audioCodec}>
                {
                  mediaSuported.audioCodecs.map(audioCodec => (
                    <MenuItem key={audioCodec} value={audioCodec}>{audioCodec}</MenuItem>
                  ))
                }
              </Select>

            </DialogContent>
            <DialogActions>
                <Button size='small' onClick={() => setIsOpen(false)}>Fechar</Button>
                <Button size='small' variant='contained' color='error'>Iniciar</Button>
            </DialogActions>
        </Dialog>

        <Stack alignItems='center' marginBottom={1} paddingRight={1} justifyContent="end" direction="row">
        {isRecording? (
          <>
            <RenderTimer/>            
            <IconButton onClick={stop}>
              <PiStopFill color="red" fontSize={20} />
            </IconButton>
          </>
          ): (
            <IconButton onClick={() => setIsOpen(true)}>
              <PiRecordFill color="red" fontSize={20} /> 
            </IconButton>
          )
        }
      </Stack>
    </>
  )
}

export default AOVRecorder