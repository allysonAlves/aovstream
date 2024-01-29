import React, { useState } from "react";
import CodeEditor from "@uiw/react-textarea-code-editor";
import WebContainer from "../webContainer";
import { makeStyles } from "@mui/styles";
import { Paper } from "@mui/material";
import CopyButton from "../copyButton";

const useStyles = makeStyles((theme) => ({
  container: {
    maxWidth: "100%",
    position: "relative",
    overflow: "auto",
    border: "1px solid black",
    "&:hover": {
      "& $copy_button": {
        opacity: 0.5,
      },
    },
  },
  copy_button: {
    zIndex: 10,
    cursor: "pointer",
    position: "absolute",
    top: 5,
    right: 7,
    transition: "0.2s ease-in-out",
    opacity: 0,
  },
  code_editor: {
    backgroundColor: "transparent",
    fontFamily:
      "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
  },
}));

const CustomCodeEditor = ({ children, language }) => {
  const classes = useStyles();
  const [code, setCode] = useState(children);

  const getLanguage = () => {
    const obj = {
      "c#": "csharp",
      javascript: "js",
    };
    return obj[language] || language;
  };

  return (
    <>
      <Paper className={classes.container} elevation={3}>
        <CopyButton className={classes.copy_button} text={children} />
        <CodeEditor
          className={classes.code_editor}
          placeholder="Digite seu código."
          language={getLanguage()}
          onChange={(evn) => setCode(evn.target.value)}
          padding={10}
          value={code}
        />
      </Paper>

      {getLanguage() == "js" ? <WebContainer code={code} /> : null}
    </>
  );
};

export default CustomCodeEditor;
