import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material';
import ConnectionsProvider from './context/ConnectionsProvider';
import AuthProvider from './context/AuthProvider.jsx';

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
  },
]);

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={darkTheme}>
      <AuthProvider>
        <ConnectionsProvider>
          <RouterProvider router={router} /> 
        </ConnectionsProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>,
)
