// React Import
import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'

// CSS
import '@renderer/assets/CSS/Library/Album.css'

// Icons
import music_icon from '@renderer/assets/Images/musical-notes-svgrepo-com.svg'
import back_arrow_icon from '@renderer/assets/Images/arrow-back-svgrepo-com.svg'
import folder_icon from '@renderer/assets/Images/folder-open-svgrepo-com.svg'

type AlbumData = {
  name: string
  author: string | null
  tracks: string[]
  coverPath: string | null
  path: string
}

function Album(): React.JSX.Element {
  const { id } = useParams()
  const nav = useNavigate()

  const [musicList, setMusicList] = React.useState<string[]>([])
  const [album, setAlbum] = React.useState<AlbumData>({
    name: 'AlbumInconnu',
    author: null,
    tracks: [],
    coverPath: null,
    path: ''
  })
  const [cover, setCover] = React.useState<undefined | string>(undefined)

  React.useEffect(() => {
    if (!id) return nav('/library')
    const listener = window.api.library.response.musics(({ tracks }) => {
      console.info(tracks)
      setMusicList(tracks)
    })

    window.api.library.request.music(id)
    window.api.library.data.cover(id).then((data) => {
      setCover(data)
    })

    return (): void => listener() as unknown as void
  }, [])

  // Launch music
  return (
    <div className={'AlbumContainer'}>
      {/*
  Navigation bar
  */}
      <div className={'AlbumNavBarContainer'}>
        <img
          onClick={() => nav('/library')}
          src={back_arrow_icon}
          alt={'Retour à la bibliothèque'}
          aria-label={'Retour'}
        />
        <img
          onClick={() => undefined}
          src={folder_icon}
          alt={'Ouvrir le dossier'}
          aria-label={'Ouvrir le dossier'}
        />
      </div>

      {/*
  Album info
  */}
      <div className={'AlbumInfo'}>
        <img src={cover || music_icon} alt={"Couverture de l'album"} className={'AlbumCover'} />
        <h1 className={'AlbumTitle'}>{id}</h1>
        <h3 className={'AlbumAuthor'}>{album.author ?? 'Artiste Inconnu'}</h3>
        <div className={'AlbumSeparator'}>
          <span className={'AlbumTrackCount'}>{musicList.length} titres chargés</span>
        </div>
      </div>

      {/*
  Liste des musiques
  */}
      <div className={'AlbumMusicList'}>
        {musicList.map((music, index): React.JSX.Element => {
          const name = music.split('.').slice(0, -1).join('.') // Enlève l'extension
          return (
            <div
              className={'AlbumMusicCard'}
              onClick={() => window.api.player.action.play(id ?? '', music)}
              key={index}
            >
              <span className={'TrackNumber'}>{index + 1}</span>
              <span className={'TrackName'}>{name}</span>
              <span className={'TrackDuration'}>3:45</span> {/* Durée fictive */}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Album
