import React, { useContext, useState } from 'react'
import { AuthContext } from '../../context/AuthProvider';
import { Button, Card, Paper, Stack, TextField } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(theme => ({
    container:{
        backgroundColor: '#202020',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',        
    },
    card:{
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
        alignItems: 'center',
        justifyContent: 'center',
        width: 300,
        height: 180,  
        padding:20     
        
    }
}))

const Login = () => {
    const {login} = useContext(AuthContext);
    const [name, setName] = useState('');

    const classes = useStyles();

    const handleSubmit = () => {
        if(name) login(name);
    }

  return (
    <Stack className={classes.container}>
        <Card elevation={3} className={classes.card}> 
            <TextField
            name='name'
            fullWidth
            variant='outlined'
            color='primary'
            value={name}
            onChange={ev => setName(ev.target.value)}
            />
            <Button  
            fullWidth           
            variant='contained' 
            color='inherit'
            onClick={handleSubmit}>
                Conectar
            </Button>
        </Card>
    </Stack>
  )
}

export default Login