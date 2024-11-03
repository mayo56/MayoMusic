// React Import
import React from 'react'
import { Routes, Route } from 'react-router-dom'

// CSS
import '@renderer/assets/CSS/Library/MusicList.css'

// Sub Pages
import MusicList from '@renderer/Pages/Sous-Pages/Library/MusicList'
import Album from '@renderer/Pages/Sous-Pages/Library/Album'

function Library(): React.JSX.Element {
  return (
    <Routes>
      {/* Library */}
      <Route path={''} element={<MusicList />} />
      {/* Show Album */}
      <Route path={':id'} element={<Album />} />
    </Routes>
  )
}

export default Library
