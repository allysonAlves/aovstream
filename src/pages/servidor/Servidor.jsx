import React, { useContext, useState } from "react";
import { makeStyles } from "@mui/styles";
import Channels from "./channels/Channels";
import Room from "./room/Room";
import {
  Box,
  Card,
  Drawer,
  IconButton,
  Paper,
  SwipeableDrawer,
  Typography,
} from "@mui/material";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { ConnectionsContext } from "../../context/ConnectionsProvider";
import MenuIcon from "@mui/icons-material/Menu";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";

const useStyles = makeStyles((theme) => ({
  container: {
    width: "100%",
    maxWidth: "100vw",
    height: "100vh",
    display: "flex",
    overflow: "hidden",
    backgroundColor: "#1c1c1c",
  },
  channelContainer: {
    [theme.breakpoints.down("md")]: {
      display: "none",
    },
  },
  iconMenuOpen: {
    display: "none",
    marginRight: 8,
    [theme.breakpoints.down("md")]: {
      display: "block",
    },
  },
  drawerMenu: {},
  boxChat: {
    flex: 1,
  },
  chatHeader: {
    height: 55,
    padding: 15,
    display: "flex",
    alignItems: "center",
  },
}));

const Servidor = () => {
  const classes = useStyles();
  const [menuOpen, setMenuOpen] = useState(false);
  const { currentChannel } = useContext(ConnectionsContext);

  return (
    <section className={classes.container} spacing={0}>
      <Box className={classes.channelContainer}>
        <Channels />
      </Box>

      <Drawer
        PaperProps={{
          sx: {
            backgroundColor: "transparent",
            boxShadow: "none",
            display: "flex",
            flexDirection: "row",
            alignItems: "start",
            backgroundImage: "none",
          },
        }}
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
      >
        <Channels />
        <IconButton onClick={() => setMenuOpen(false)}>
          <ArrowLeftIcon sx={{ fontSize: 21 }} />
        </IconButton>
      </Drawer>

      <Box       
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <Card elevation={2} className={classes.chatHeader}>
          <Box className={classes.iconMenuOpen}>
            <IconButton onClick={() => setMenuOpen(true)}>
              <MenuIcon />
            </IconButton>
          </Box>
          <Typography color="GrayText" fontWeight={600}>
            {currentChannel?.name || "AOV STREAM"}
          </Typography>
        </Card>
        {currentChannel ? (
          <Paper sx={{ flex: 1 }}>
            <Room />
          </Paper>
        ) : (
          <Typography sx={{textAlign:'center', mt:5}} color='GrayText'>
            Entre em um canal para visualizar o chat
          </Typography>
        )}
      </Box>
    </section>
  );
};

export default Servidor;
