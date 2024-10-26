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
      console.log('enter useEffect')
      window.api.library.req()
      window.api.library.MusicLibrary((musics): void => {
        console.log(musics)
        setMusics(musics as unknown as Music[])
      })
      console.log('end of useEffect')
    }
  }, [])
  return (
    <div className={'libraryContainer'}>
      <LibrarySearchBar />
      <div className={'loadBar'}>
        <span className={'count'}>{musics.length} titres chargés</span>
        <div className={'bar'}></div>
      </div>
      {/*
      Liste des musiques
      */}
      <div className={'libraryMusicList'}>
        {musics.map((el, key) => {
          return (
            <div key={key} className={'libraryMusic'}>
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
