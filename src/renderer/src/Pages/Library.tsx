// React Import
import React from 'react'
import { Routes, Route } from 'react-router-dom'

// CSS
import '@renderer/assets/CSS/Components/Library.css'

// Sub Pages
import MusicList from '@renderer/Pages/Sous-Pages/Home/Library'
import Album from '@renderer/Pages/Sous-Pages/Home/Album'

function Library(): React.JSX.Element {
  const [inAlbum, setInAlbum] = React.useState<{ title: string; cover: string | null } | null>(null)
  return (
    <Routes>
      {/* Library */}
      <Route path={''} element={<MusicList setAlbum={setInAlbum} />} />
      {/* Show Album */}
      <Route path={':id'} element={<Album setAlbum={setInAlbum} album={inAlbum!} />} />
    </Routes>
  )
}

export default Library
