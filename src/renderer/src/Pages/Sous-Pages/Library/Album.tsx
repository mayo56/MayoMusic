// React Import
import React from 'react'
import { useParams } from 'react-router-dom'

// CSS
import '@renderer/assets/CSS/Library/Album.css'

// Icons
import music_icon from '@renderer/assets/Images/musical-notes-svgrepo-com.svg'

function Album(): React.JSX.Element {
  const { id } = useParams()

  const [musicList, setMusicList] = React.useState<string[]>([])
  const [cover, setCover] = React.useState<undefined | string>(undefined)

  React.useEffect(() => {
    if (!id) return
    window.api.library.reqMusics(id)
    window.api.library.MusicsList((data) => {
      setMusicList(data.musics)
      setCover(data.cover)
    })
  }, [])

  // Launch music
  return (
    <div className={'AlbumContainer'}>
      {/*
      Album info
      */}
      <div className={'info'}>
        <img src={cover ? cover : music_icon} alt={'album cover'} />
        <span className={'texte'}>{id}</span>
      </div>
      <hr />

      {/*
      Liste des musiques
      */}
      <div className={'AlbumMusicList'}>
        {musicList.map((music, index) => {
          const name = music.split('.')
          name.pop()
          return (
            <div
              className={'AlbumMusicCardContainer'}
              onClick={() => window.api.player.playMusic(id!, music)}
              key={index}
            >
              <span>
                {index + 1 + '. '}
                {name.join('.')}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Album
