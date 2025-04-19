/// <reference types="vite/client" />
import React from 'react'
import ReactDOM from 'react-dom/client'
import { DevPlayground } from './DevPlayground'
import { Demo } from './Demo'
import './index.css'

// Determine if we're in development mode
const isDevelopment = import.meta.env.DEV

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {!isDevelopment ? <DevPlayground /> : <Demo />}
  </React.StrictMode>,
) 
