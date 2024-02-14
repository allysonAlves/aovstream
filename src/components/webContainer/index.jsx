import React, { createRef, useEffect, useState } from "react";
import { Button, CircularProgress, IconButton, Stack } from "@mui/material";
import BoltIcon from "@mui/icons-material/Bolt";
import ANSIToHtml from "ansi-to-html";
import { getWebContainerInstance } from "../../utils/web-container";
import { green } from "@mui/material/colors";
import { FaTerminal } from "react-icons/fa6";
import { IoIosSettings } from "react-icons/io";
import { makeStyles } from "@mui/styles";

var ANSIConverter = new ANSIToHtml();

const useStyles = makeStyles((theme) => ({
  scrollView: {
    padding: "9px 10px 5px 15px",
    margin: "5px 0 10px 0",
    overflowY: "auto",
    maxHeight: 400,
    minHeight: 40,
  },
  relative: {
    position: "relative",
  },
  configMenu: {
    position: "absolute",
    top: 4,
    right: 2,
    alignItems: "center",
  },
  terminalClass: {
    fontFamily: "monospace",
    wordBreak: "break-word",
  },
}));

const WebContainer = ({ code, elevation = 1 }) => {
  const classes = useStyles();
  const [showTerminal, setShowTerminal] = useState(false);
  const [running, setRunning] = useState(false);
  const [terminalResponse, setTerminalResponse] = useState([]);
  const [result, setResult] = useState([]);

  const terminalRef = createRef(null);

  useEffect(() => {
    terminalRef?.current?.scrollIntoView({ behavior: "smooth" });
  }, [terminalResponse, result]);

  const runCode = async () => {   
    setTerminalResponse([
      '🔥 <span style="color: green;"> install dependencies!</span><br>',
    ]);
    setResult([
      '🔥 <span style="color: green;"> install dependencies!</span><br>',
    ]);   

    setRunning(true);

    const initialCode = [
      `import axios from 'axios';`,
      `import 'isomorphic-fetch';`,
      ``,
    ].join("\n");

    const webContainer = await getWebContainerInstance();
    await webContainer.mount({
      "index.js": {
        file: {
          contents: initialCode + code,
        },
      },
      "package.json": {
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
    });

    const install = await webContainer.spawn("npm", ["install"]);

    install.output.pipeTo(
      new WritableStream({
        write(data) {
          console.log(terminalResponse);
          setTerminalResponse((previous) => [
            ...previous,
            ANSIConverter.toHtml(data),
          ]);
        },
      })
    );
    await install.exit;

    const start = await webContainer.spawn("npm", ["run", "start"]);

    start.output.pipeTo(
      new WritableStream({
        write(data) {
          console.log(terminalResponse);
          const dataHtml = ANSIConverter.toHtml(data);
          setTerminalResponse((previous) => [...previous, dataHtml]);
          if (!/node index.js/.test(dataHtml))
            setResult((previous) => [...previous, dataHtml]);
        },
      })
    );

    await start.exit;

    setRunning(false);
  };

  return (
    <div className={classes.relative}>
      <div className={classes.scrollView} elevation={0}>
        <Stack direction="row" className={classes.configMenu}>
          <IconButton onClick={() => setShowTerminal((prev) => !prev)}>
            <FaTerminal color={showTerminal ? green[900] : "gray"} size="14" />
          </IconButton>

          <IconButton onClick={() => {}}>
            <IoIosSettings color="gray" size="14" />
          </IconButton>

          <Button
            sx={{ marginLeft: 1 }}
            disabled={running}
            onClick={runCode}
            size="small"
            variant="contained"
            color="success"
          >
            {running ? (
              <CircularProgress
                size={20}
                sx={{ color: green[900], marginRight: 1 }}
              />
            ) : (
              <BoltIcon color="inherit" />
            )}
            Rodar
          </Button>
        </Stack>

        {showTerminal
          ? terminalResponse.map((line, i) => (
              <div
                className={classes.terminalClass}
                key={i}
                dangerouslySetInnerHTML={{ __html: line }}
              />
            ))
          : result.map((line, i) => (
              <div
                className={classes.terminalClass}
                key={i}
                dangerouslySetInnerHTML={{ __html: line }}
              />
            ))
        }

        <div ref={terminalRef}></div>
      </div>
    </div>
  );
};

export default WebContainer;
