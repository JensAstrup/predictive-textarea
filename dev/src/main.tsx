/// <reference types="vite/client" />
import React from 'react'
import ReactDOM from 'react-dom/client'
import { DevPlayground } from './Dev'
import './styles/globals.css'
import './styles/dev.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <DevPlayground />
  </React.StrictMode>,
) 
