import React, { createContext } from 'react'
import { getWebContainerInstance } from '../utils/web-container'

export const WebContainerContext = createContext()
WebContainerContext.displayName = 'WebContainer'

const WebContainerProvider = ({children}) => {
    
  return (
    <WebContainerContext.Provider value={{getWebContainerInstance}}>
        {children}
    </WebContainerContext.Provider>
  )
}

export default WebContainerProvider