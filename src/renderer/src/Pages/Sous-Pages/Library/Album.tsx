// React Import
import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'

// CSS
import '@renderer/assets/CSS/Library/Album.css'

// Icons
import music_icon from '@renderer/assets/Images/musical-notes-svgrepo-com.svg'
import back_arrow_icon from '@renderer/assets/Images/arrow-back-svgrepo-com.svg'
import folder_icon from '@renderer/assets/Images/folder-open-svgrepo-com.svg'

function Album(): React.JSX.Element {
  const { id } = useParams()
  const nav = useNavigate()

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
      Navigation bar
      */}
      <div className={'AlbumNavBarContainer'}>
        <img onClick={() => nav('/library')} src={back_arrow_icon} alt={'arrow back icon'} />
        <img src={folder_icon} alt={'folder icon'} />
      </div>
      {/*
      Album info
      */}
      <div className={'info'}>
        <img src={cover ? cover : music_icon} alt={'album cover'} />
        <span className={'texte'}>{id}</span>
        <div className={'separator'}>
          <span className={'texte'}>{musicList.length} titres chargés</span>
          <div className={'bar'} />
        </div>
      </div>

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
              <span className={'number'}>{index + 1}</span>
              <span>{name.join('.')}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Album
