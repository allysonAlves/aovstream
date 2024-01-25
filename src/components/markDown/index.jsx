import React from 'react'

import ReactMarkdown from "react-markdown";
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(() => ({
  pre_code: {
    position: 'relative',   
    '&:hover': {
      "& $icon_code": {
        opacity: 0.5,
        cursor: 'pointer',
        "&:hover": {
          opacity: 0.3
        }
      }
    }    
  },  
  icon_code:{
    opacity: 0,    
  }
}))

const CopyCode = ({children}) => { 
  const classes = useStyles();
  return (    
    <pre className={classes.pre_code}>
      <ContentCopyIcon className={classes.icon_code} style={{position:'absolute', top:7, right:10, color: 'gray'}} fontSize='small'/>
      {children}
    </pre>
  )
}

const MarkDown = ({children}) => {
  return (
    <ReactMarkdown 
    remarkPlugins={[remarkGfm]}
    components={{ 
      pre: ({children}) => <CopyCode>{children}</CopyCode>,     
      code({ node, inline, className, children, ...props }) {
        const match = /language-(\w+)/.exec(className || '');

        return !inline && match ? (
          <SyntaxHighlighter style={dracula} PreTag="div" language={match[1]} {...props}>
            {String(children).replace(/\n$/, '')}
          </SyntaxHighlighter>
        ) : (         
          <code className={className} {...props}>            
            {children}
          </code>          
        );
      },
    }}
    >
      {children}
    </ReactMarkdown>
  )
}

export default MarkDown