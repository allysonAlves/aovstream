import React, { useState } from 'react'
import { PiCopySimpleBold } from 'react-icons/pi'
import { GiCheckMark } from "react-icons/gi";
import { green } from '@mui/material/colors';


const CopyButton = ({text, ...props}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000)
    })
  }

  return (
    <>
    {
      copied ? (
        <GiCheckMark style={{color: green[500]}} {...props}/>
      ) : (
        <PiCopySimpleBold 
        {...props} 
        size={16}
        onClick={handleCopy}/> 
      )
    }
    </>
  )
}

export default CopyButton