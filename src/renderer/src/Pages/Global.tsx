// React import
import React from 'react'
import { Route, Routes } from 'react-router-dom' // Style
import '@renderer/assets/CSS/Global/Global.css' // Différentes pages
import Library from '@renderer/Pages/Library' // Side Bar
import GlobalController from '@renderer/components/Global/GlobalController'
import SideBar from '@renderer/components/Global/SideBar'
import Parameters from '@renderer/Pages/Parameters'

function Global(): React.JSX.Element {
  return (
    <div className={'GlobalContainer'}>
      {/*
      SideBar (Pour toutes les pages)
      */}
      <div className={'GlobalSideBar'}>
        <GlobalController />
        <SideBar />
      </div>

      {/*
      Différentes pages
      */}
      <div className={'GlobalPages'}>
        <Routes>
          {/*
          Pages paramètres
          */}
          <Route path={'/settings/*'} element={<Parameters />} />

          {/*
          Pages de bibliothèque et album
          */}
          <Route path={'/library/*'} element={<Library />} />
        </Routes>
      </div>
    </div>
  )
}

export default Global
