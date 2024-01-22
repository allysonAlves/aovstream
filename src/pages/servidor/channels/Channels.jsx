import { makeStyles } from "@mui/styles";
import {
  Avatar,
  CssBaseline,
  Divider,
  Icon,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import React from "react";

import ChannelItem from "./components/channelItem";
import ProfileHeader from "./components/profileHeader";

const useStyles = makeStyles((theme) => ({
  container: {
    width: "250px",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    userSelect: 'none',
    WebkitUserSelect: 'none',
    msUserSelect: 'none',
  },
  stackChannels: {
    overflowY: "auto",
    padding: "10px",
    marginTop: 30,
  },
  profileStack: {
    padding: "10px 15px 5px 10px",
    display: "flex",
    alignItems: "end",
    justifyContent: "space-between",
  },
}));

const Channels = () => {
  const classes = useStyles();
  return (
    <Paper elevation={2} className={classes.container}>
      <CssBaseline />      
      <ProfileHeader/>
      <Stack spacing={5} className={classes.stackChannels}>
        <ChannelItem /> 
      </Stack>
    </Paper>
  );
};

export default Channels;
