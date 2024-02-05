import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthProvider";
import { Button, Card, Paper, Stack, TextField } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Opacity } from "@mui/icons-material";

const useStyles = makeStyles((theme) => ({
  container: {
    backgroundColor: "#202020",
    height: "100vh",
    display: "flex",
    alignItems: "center",    
    flexDirection: "column",
    padding: 24
  },
  card: {
    display: "flex",
    flexDirection: "column",
    gap: 20,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    minWidth:350
  },
}));

const Login = () => {
  const { login } = useContext(AuthContext);
  const [name, setName] = useState("");

  const classes = useStyles();

  const handleSubmit = () => {
    if (name) login(name);
  };

  return (
    <Stack spacing={3} className={classes.container}>
      <img
        style={{ opacity: 0.8 }}
        width={250}
        src="images/icon/aovstreamlogo1.png"
      />
      <Card elevation={3} className={classes.card}>
        <TextField
          placeholder="Digite seu nome"
          name="name"
          fullWidth
          variant="outlined"
          color="primary"
          value={name}
          onChange={(ev) => setName(ev.target.value)}
        />
        <Button
          fullWidth
          variant="contained"
          color="inherit"
          onClick={handleSubmit}
        >
          Entrar
        </Button>
      </Card>
    </Stack>
  );
};

export default Login;
