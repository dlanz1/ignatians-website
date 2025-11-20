/**
 * Application entry point.
 *
 * This file mounts the React application to the DOM.
 * It renders the root `App` component inside `React.StrictMode`.
 *
 * @module main
 */

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
