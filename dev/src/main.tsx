/// <reference types="vite/client" />
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Dev } from './Dev'
import './styles/dev.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Dev />
  </React.StrictMode>,
) 
