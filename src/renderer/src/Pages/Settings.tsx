// React Import
import React from 'react'
import { Outlet } from 'react-router-dom'

// CSS
import '@renderer/assets/CSS/Settings/settings.css'

// Components / Pages
import MenuNav from '@renderer/components/Settings/MenuNav'

function Settings(): React.JSX.Element {
  return (
    <div className={'SettingsContainer'}>
      <MenuNav />
      <div className={'SettingsPage'}>
        <Outlet />
      </div>
    </div>
  )
}

export default Settings
