import React from 'react'
import music_icon from '../assets/music.svg'
import '../assets/Components/Library.css'
import LibrarySearchBar from '@renderer/components/LibrarySearchBar'

type Music = {
  title: string
  path: string
  cover: string | null
}

function Library(): React.JSX.Element {
  const [musics, setMusics] = React.useState<Music[]>([])

  React.useEffect(() => {
    return (): void => {
      window.api.library.req()
      window.api.library.MusicLibrary((musics): void => {
        setMusics(musics as unknown as Music[])
        console.info('Musics loaded', musics)
      })
    }
  }, [])
  return (
    <div className={'libraryContainer'}>
      {/*
      Barre de recherche
      */}
      <LibrarySearchBar />
      {/*
      Indications de chargement
      */}
      <div className={'loadBar'}>
        <div className={'bar_left'}></div>
        <span className={'count'}>{0} playlist chargés</span>
        <div className={'bar'}></div>
      </div>
      <div className={'loadBar'}>
        <div className={'bar_left'}></div>
        <span className={'count'}>{musics.length} titres chargés</span>
        <div className={'bar'}></div>
      </div>
      {/*
      Liste des musiques
      */}
      <div className={'libraryMusicList'}>
        {musics.map((el, key) => {
          return (
            <div key={key} className={'libraryMusic'} title={`${el.title} - ${el.path}`}>
              <img
                src={el.cover ? 'data:image/png;base64, ' + el.cover : music_icon}
                alt={'cover ' + el.title}
              />
              <p>{el.title}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Library
