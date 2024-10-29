import React from 'react'
import music_icon from '@renderer/assets/music.svg'
import '@renderer/assets/Components/Library.css'
import LibrarySearchBar from '@renderer/components/LibrarySearchBar'

type Music = {
  title: string
  path: string
  cover: string | null
}

function MusicList(props: {
  setAlbum: React.Dispatch<React.SetStateAction<{ title: string; cover: string | null } | null>>
}): React.JSX.Element {
  const [musics, setMusics] = React.useState<Music[]>([])

  React.useEffect(() => {
    return (): void => {
      window.api.library.reqAlbums()
      window.api.library.AlbumsLibrary((musics): void => {
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
      <span color={'red'}>Prototype</span>
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
            <div
              onClick={() => props.setAlbum({ title: el.title, cover: el.cover })}
              key={key}
              className={'libraryMusic'}
              title={`${el.title} - ${el.path}`}
            >
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

export default MusicList
