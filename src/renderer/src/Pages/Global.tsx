// React import
import React from 'react'
import { Outlet } from 'react-router-dom'

// Style
import '@renderer/assets/CSS/Global/Global.css'

// Components
import GlobalController from '@renderer/components/Global/GlobalController'
import SideBar from '@renderer/components/Global/SideBar'
import Player from '@renderer/components/Global/Player'

function Global(): React.JSX.Element {
  return (
    <div className={'mm-global-container'}>
      {/*
      SideBar (Pour toutes les pages)
      */}
      <div className={'mm-global-left-bar-container'}>
        <GlobalController />
        <SideBar />
      </div>

      {/*
      Affichage des différentes pages
      (Layout)
      */}
      <div className={'mm-global-pages-container'}>
        <div className={'mm-global-pages-content'}>
          <Outlet />
        </div>
        <Player />
      </div>
    </div>
  )
}

export default Global
