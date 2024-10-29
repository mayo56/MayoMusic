import React, { useEffect } from 'react'
import '@renderer/assets/Components/Album.css'

function Album(props: {
  setAlbum: React.Dispatch<React.SetStateAction<{ title: string; cover: string | null } | null>>
  album: { title: string; cover: string | null }
}): React.JSX.Element {
  const [listOfMusic, setList] = React.useState<string[]>([])
  useEffect(() => {
    return (): void => {
      console.log('enter useEffect')
      window.api.library.reqMusics(props.album.title)
      window.api.library.MusicsList((musics) => {
        setList(musics as unknown as string[])
        console.warn(musics)
      })
      console.log('sortie useEffect')
    }
  }, [])

  // Launch music
  const playMusic = (name: string): void => {
    // Event pour jouer la musique
    window.api.player.playMusic(props.album.title, name)
  }
  return (
    <div className={'albumListContainer'}>
      <button onClick={() => props.setAlbum(null)}>{'<-'}</button>
      <p>{props.album.title}</p>
      <hr />
      {listOfMusic.map((musicName, i) => {
        return (
          <div onClick={() => playMusic(musicName)} key={i} className={'musicCardContainer'}>
            <p>{musicName}</p>
          </div>
        )
      })}
    </div>
  )
}

export default Album
