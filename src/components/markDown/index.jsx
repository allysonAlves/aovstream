import React, { useState } from 'react'
import ReactMarkdown from "react-markdown";
import remarkGfm from 'remark-gfm'
import CustomCodeEditor from '../customCodeEditor/index.jsx';

const MarkDown = ({children}) => {
  return (
    <ReactMarkdown  
    remarkPlugins={[remarkGfm]}
    components={{ 
      code({ node, inline, className, children, ...props }) {
        const match = /language-(\w+)/.exec(className || '');

        return !inline && match ? (
          <CustomCodeEditor language={match[1]}>
            {String(children).replace(/\n$/, '')}
          </CustomCodeEditor>         
        ) : (         
          <CustomCodeEditor>            
            {String(children).replace(/\n$/, '')}
          </CustomCodeEditor>          
        );
      },
    }}
    >
      {children}
    </ReactMarkdown>
  )
}

export default MarkDown