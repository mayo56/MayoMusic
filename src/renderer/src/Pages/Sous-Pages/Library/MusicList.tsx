// React Import
import React from 'react'
import { useNavigate } from 'react-router-dom'

// Icons
import music_icon from '@renderer/assets/Images/musical-notes-svgrepo-com.svg'

// Components
import LibrarySearchBar from '@renderer/components/Library/LibrarySearchBar'

// CSS
import '@renderer/assets/CSS/Library/MusicList.css'

type Music = {
  title: string
  path: string
  author: string | null
  cover: string | null
  isActive: boolean
}

function MusicList(): React.JSX.Element {
  const [musics, setMusics] = React.useState<Music[]>([])

  React.useEffect(() => {
    window.api.library.reqAlbums()
    window.api.library.AlbumsList((musics): void => {
      setMusics(musics as unknown as Music[])
    })
  }, [])

  const nav = useNavigate()
  return (
    <div className={'MusicListContainer'}>
      {/*
      Barre de recherche
      */}
      <LibrarySearchBar />

      {/*
      Indications de chargement
      */}
      <div className={'loadBar'}>
        <div className={'bar_left'}></div>
        <span className={'count'}>{musics.length} titres chargés</span>
        <div className={'bar'}></div>
      </div>

      {/*
      Liste des musiques
      */}
      <div className={'library'}>
        {musics.map((el, key) => {
          return (
            <div
              key={key}
              className={'libraryMusic'}
              title={`${el.title}\n${el.path}`}
              onClick={() => nav(`/library/${el.title}`)}
            >
              <img src={el.cover || music_icon} alt={'cover ' + el.title} />
              <div className={'libraryMusicInfo'}>
                <p className={'title'}>{el.title}</p>
                <p className={'author'}>{el.author ? el.author : 'Artiste inconnue'}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default MusicList
