import React from 'react'
import { BrowserRouter } from 'react-router'
import AppRouter from './app-router'
import { createRoot } from 'react-dom/client'
import '../index.css'



function App() {
  return (
    <BrowserRouter>
      <AppRouter/>
    </BrowserRouter>
  )
}


createRoot(document.getElementById('setup')).render(
    <App />
)
