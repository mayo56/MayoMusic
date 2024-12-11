// React Import
import React from 'react'

// Components
import LibrarySearchBar from '@renderer/components/Library/LibrarySearchBar'

// CSS
import '@renderer/assets/CSS/Library/MusicList.css'
import AlbumCard from '@renderer/components/Library/AlbumCard'

type Album = {
  name: string
  path: string
  author: string | null
  isActive: boolean
}

function MusicList(): React.JSX.Element {
  const [musics, setMusics] = React.useState<Album[]>([])

  React.useEffect(() => {
    window.api.library.request.albums()
    window.api.library.response.albums((musics): void => {
      setMusics(musics as unknown as Album[])
    })
  }, [])

  return (
    <div className="MusicListContainer">
      {/*
          Barre de recherche et indicateur de chargement
      */}
      <div className="header">
        <LibrarySearchBar />
        <div className="loadBar">
          <div className="bar_left"></div>
          <span className="count">{musics.length} titres chargés</span>
          <div className="bar"></div>
        </div>
      </div>

      {/*
         Liste des musiques
      */}
      <div className="library">
        {musics.map((album, key) => (
          <AlbumCard name={album.name} author={album.author} path={album.path} key={key} />
        ))}
      </div>
    </div>
  )
}

export default MusicList
