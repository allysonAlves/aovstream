import React, { useState } from 'react'
import { Button, CircularProgress, IconButton, Paper, Stack, Typography } from '@mui/material';
import BoltIcon from '@mui/icons-material/Bolt';
import ANSIToHtml from 'ansi-to-html'; 
import { getWebContainerInstance } from '../../utils/web-container';
import { green } from '@mui/material/colors';
import { FaTerminal } from "react-icons/fa6";
import { IoIosSettings } from "react-icons/io";


var ANSIConverter = new ANSIToHtml();

const WebContainer = ({code, elevation = 1}) => {
  const [terminalResponse, setTerminalResponse] = useState([]);
  const [result, setResult] = useState([]);
  const [showTerminal, setShowTerminal] = useState(false)
  const [running, setRunning] = useState(false);

  const runCode = async () => { 
    setTerminalResponse(['🔥 <span style="color: green;"> install dependencies!</span><br>']);
    setResult(['🔥 <span style="color: green;"> install dependencies!</span><br><br>'])

    setRunning(true)

    const initialCode = [      
      `import axios from 'axios';`,
      `import 'isomorphic-fetch';`,
      ``  
    ].join('\n'); 
    
    const webContainer = await getWebContainerInstance();
    await webContainer.mount({
      'index.js': {
        file: {
          contents: initialCode + code,
        },
      },
      'package.json': {
        file: {
          contents: `{
      "name": "example-app",
      "type": "module",
      "dependencies": {                      
        "axios": "latest",
        "isomorphic-fetch": "latest"
      },
      "scripts": {
        "start": "node index.js"
      }
    }`.trim(),
        },
      },
    })       

    const install = await webContainer.spawn('npm', ['install']);
    
    install.output.pipeTo(
      new WritableStream({
        write(data){
          setTerminalResponse(previous => [...previous, ANSIConverter.toHtml(data)])
        }
      })
    )
    await install.exit

    const start = await webContainer.spawn('npm', ['run','start'])

    start.output.pipeTo(
      new WritableStream({
        write(data){  
          const dataHtml = ANSIConverter.toHtml(data);     
          setTerminalResponse(previous => [...previous, dataHtml])
          if(!/node index.js/.test(dataHtml))
            setResult(previous => [...previous, dataHtml])
        }
      })
    )

    await start.exit  
    
    setRunning(false);
  }

  return (
    <div style={{position: 'relative'}}>
      <div        
        elevation={0}      
        style={{          
          padding: '9px 10px 5px 15px', 
          margin:'5px 0 10px 0',       
          overflowY: 'auto',
          maxHeight: 400,
          minHeight: 40,   
        }}>
          <Stack direction='row' sx={{position: 'absolute', top:4, right:120}}>
            <IconButton            
            onClick={() => setShowTerminal(prev => !prev)}>
              <FaTerminal color={showTerminal? green[900]: 'gray'} size='14'/>
            </IconButton>

            <IconButton           
            onClick={() => {}}>
              <IoIosSettings color='gray' size='14'/>
            </IconButton>  
          </Stack>

          <Button  
          sx={{position: 'absolute', top:4, right:10}}
          disabled={running}
          onClick={runCode}
          size='small' 
          variant='contained'  
          color='success'       
          style={{ fontWeight: '700'}}>
            {running ? ( 
              <CircularProgress 
              size={20} 
              sx={{color: green[900], marginRight:1 }}/>) : (
                <BoltIcon color='inherit'/>
              )
            }
            Rodar
          </Button>        
          {
            showTerminal? 
            terminalResponse.map((line, i) => (             
              <div 
              style={{
                fontFamily: 'monospace', 
                wordBreak: 'break-word',              
              }} 
              key={i} 
              dangerouslySetInnerHTML={{__html: line}}/>
            ))
            :
            result.map((line, i) => {             
              return <div style={{fontFamily: 'monospace', wordBreak: 'break-word', maxWidth: '100%'}} key={i} dangerouslySetInnerHTML={{__html: line}}/>
              
            })
          }

      </div>  

    </div>
  )
}

export default WebContainer