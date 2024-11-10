// React Import
import React from 'react'
import { Route, Routes } from 'react-router-dom'

// CSS
import '@renderer/assets/CSS/Settings/settings.css'

// Components / Pages
import MenuNav from '@renderer/components/Settings/MenuNav'
import YoutubeDLPage from '@renderer/Pages/Sous-Pages/Settings/Download/Youtube-DL'
import ComingSoon from '@renderer/Pages/Sous-Pages/Settings/Error/CommingSoon'
import GlobalSettings from '@renderer/Pages/Sous-Pages/Settings/Params/GlobalSettings'

function Settings(): React.JSX.Element {
  return (
    <div className={'SettingsContainer'}>
      <MenuNav
        menuList={[
          [
            {
              label: 'Global',
              path: '/settings',
              experimental: true
            },
            {
              label: 'Info',
              path: '/settings/download',
              experimental: true
            }
          ],
          [
            {
              label: 'yt-dlp',
              path: '/settings/download/yt-dlp',
              experimental: true
            }
          ]
        ]}
        categories={['User settings', 'Téléchargement']}
      />
      <div className={'SettingsPage'}>
        <Routes>
          <Route path={'download/yt-dlp'} element={<YoutubeDLPage />} />
          <Route path={'/'} element={<GlobalSettings />} />
          <Route path={'*'} element={<ComingSoon />} />
        </Routes>
      </div>
    </div>
  )
}

export default Settings
