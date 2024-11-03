// React Import
import React from 'react'
import { useParams } from 'react-router-dom'

// CSS
import '@renderer/assets/CSS/Library/Album.css'

function Album(): React.JSX.Element {
  const { id } = useParams()

  const [musicList, setMusicList] = React.useState<string[]>([])

  React.useEffect(() => {
    if (!id) return
    window.api.library.reqMusics(id)
    window.api.library.MusicsList((musics) => {
      setMusicList(musics)
    })
  }, [])

  // Launch music
  return (
    <div className={'AlbumContainer'}>
      <h1>{id}</h1>
      <hr />
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
