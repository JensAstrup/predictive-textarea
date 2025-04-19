/// <reference types="vite/client" />
import React from 'react'
import ReactDOM from 'react-dom/client'
import { DevPlayground } from './DevPlayground'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <DevPlayground />
  </React.StrictMode>,
) 
