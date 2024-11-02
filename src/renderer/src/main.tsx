import React from 'react'
import ReactDOM from 'react-dom/client'
import Global from './Pages/Global'
import { BrowserRouter } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <Global />
    </BrowserRouter>
  </React.StrictMode>
)
