// React Import
import React from 'react'

// Components
import LibrarySearchBar from '@renderer/components/Library/LibrarySearchBar'

// CSS
import '@renderer/assets/CSS/Library/MusicList.css'
import AlbumCard from '@renderer/components/Library/AlbumCard'

type AlbumData = {
  name: string
  author: string | null
  tracks: string[]
  coverPath: string | null
  path: string
}

function MusicList(): React.JSX.Element {
  const [musics, setMusics] = React.useState<AlbumData[]>([])

  React.useEffect(() => {
    const removeListener = window.api.library.response.albums((data) => {
      setMusics(data)
    })

    window.api.library.request.album()

    return (): void => removeListener() as unknown as void
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
