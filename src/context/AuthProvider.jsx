import React, { createContext, useState } from 'react'
import Login from '../pages/login/Login';
import { v4 as uuidv4 } from 'uuid';

export const AuthContext = createContext();

const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);

    const login = (name, password) => {
        setUser({name, id: uuidv4()});
    }

  return (
    <AuthContext.Provider value={{user,login}}>
        {user? children : <Login/>}
    </AuthContext.Provider>
  )
}

export default AuthProvider