import React from 'react'

import ReactMarkdown from "react-markdown";
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/cjs/styles/prism';

const MarkDown = ({children}) => {
  return (
    <ReactMarkdown 
    remarkPlugins={[remarkGfm]}
    components={{
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