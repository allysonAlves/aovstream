import { makeStyles } from "@mui/styles";
import {  
  CssBaseline,    
  IconButton,
  Paper,
  Stack,  
} from "@mui/material";
import React, { useContext} from "react";

import ChannelItem from "./components/channelItem";
import ProfileHeader from "./components/profileHeader";
import { ConnectionsContext } from "../../../context/ConnectionsProvider";
import { PiRecordFill, PiStopFill } from "react-icons/pi";
import AOVRecorder from "../../../components/Recorder/AOVRecorder";

const useStyles = makeStyles((theme) => ({
  container: {
    width: "250px",
    minWidth: "250px",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    userSelect: "none",
    WebkitUserSelect: "none",
    msUserSelect: "none",
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
  const { channels, joinChannel } = useContext(ConnectionsContext);
  const classes = useStyles(); 

  const handleJoinChannel = (channel) => {
    joinChannel(channel);
  }; 

  return (
    <Paper elevation={2} className={classes.container}>
      <CssBaseline />
      <ProfileHeader />
      <Stack flex={1} spacing={5} className={classes.stackChannels}>
        {Object.values(channels).map((channel) => (
          <ChannelItem
            key={channel.id}
            onDoubleClick={handleJoinChannel}
            channel={channel}
          />
        ))}
      </Stack> 
      <AOVRecorder/>          
    </Paper>
  );
};

export default Channels;
