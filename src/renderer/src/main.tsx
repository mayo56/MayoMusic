import React from 'react'
import ReactDOM from 'react-dom/client'
import Home from './Pages/Home'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Parameters from '@renderer/Pages/Parameters'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path={'/'} element={<Home />} />
        <Route path={'/parameters'} element={<Parameters />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
