// Import React
import { HashRouter, Route, Routes } from 'react-router-dom'
import ReactDOM from 'react-dom/client'
import React from 'react'

// Layout
import Settings from '@renderer/Pages/Settings'
import Global from './Pages/Global'

// Import pages
import ComingSoon from '@renderer/Pages/Sous-Pages/Settings/Error/CommingSoon'
import MusicList from '@renderer/Pages/Sous-Pages/Library/MusicList'
import Album from '@renderer/Pages/Sous-Pages/Library/Album'
import General from '@renderer/Pages/Sous-Pages/Settings/Pages/General'
import Music from '@renderer/Pages/Sous-Pages/Settings/Pages/Music'
import Advanced from '@renderer/Pages/Sous-Pages/Settings/Pages/Advanced'
import About from '@renderer/Pages/Sous-Pages/Settings/Pages/About'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <HashRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
      <Routes>
        {/* Layout Global */}
        <Route element={<Global />}>
          {/* Page d'info */}
          <Route index element={<p>[INFO] - Page d&#39;accueille</p>} />

          {/* Routes Library */}
          <Route path={'/library'}>
            <Route index element={<MusicList />} />
            <Route path={':id'} element={<Album />} />
          </Route>

          {/* Routes Paramètres */}
          <Route path={'/settings'} element={<Settings />}>
            <Route index element={<General />} />
            <Route path={'music'} element={<Music />} />
            <Route path={'advanced'} element={<Advanced />} />
            <Route path={'about'} element={<About />} />
            <Route path={'*'} element={<ComingSoon />} />
          </Route>
        </Route>
      </Routes>
    </HashRouter>
  </React.StrictMode>
)
