import { useNavigate } from 'react-router-dom'
import React from 'react'

// Icons
import music_icon from '@renderer/assets/Images/musical-notes-svgrepo-com.svg'

const AlbumCard = (props: {
  name: string
  author: string | null
  path: string
}): React.JSX.Element => {
  const nav = useNavigate()
  const [cover, setCover] = React.useState<string>(music_icon)

  React.useEffect(() => {
    window.api.library.data.cover(props.name).then((res) => {
      if (res) {
        setCover(res)
      }
    })
  }, [])

  return (
    <div
      className={'libraryMusic'}
      title={`${props.name}\nBy ${props.author ?? 'Artiste Inconnu'}`}
      onClick={() => nav(`/library/${props.name}`)}
    >
      <img src={cover} alt={'cover ' + props.name} />
      <div className={'libraryMusicInfo'}>
        <p className={'title'}>{props.name}</p>
        <p className={'author'}>{props.author ? props.author : 'Artiste inconnue'}</p>
      </div>
    </div>
  )
}

export default AlbumCard
