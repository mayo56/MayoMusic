import React from 'react'
import '../assets/Components/Library.css'
import MusicList from '@renderer/Pages/Sous-Pages/Home/Library'
import Album from '@renderer/Pages/Sous-Pages/Home/Album'

function Library(): React.JSX.Element {
  const [inAlbum, setInAlbum] = React.useState<{ title: string; cover: string | null } | null>(null)
  const DisplayIntoLibrary = (): React.JSX.Element => {
    if (!inAlbum) {
      return <MusicList setAlbum={setInAlbum} />
    } else {
      return <Album album={inAlbum} setAlbum={setInAlbum} />
    }
  }
  return (
    <>
      <DisplayIntoLibrary />
    </>
  )
}

export default Library
