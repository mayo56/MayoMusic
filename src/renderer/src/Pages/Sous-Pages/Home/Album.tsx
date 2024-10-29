import React, { useEffect } from 'react'

function Album(props: {
  setAlbum: React.Dispatch<React.SetStateAction<{ title: string; cover: string | null } | null>>
  album: { title: string; cover: string | null }
}): React.JSX.Element {
  const [listOfMusic, setList] = React.useState<string[]>([])
  useEffect(() => {
    return (): void => {
      window.api.library.reqMusics(props.album.title)
      window.api.library.MusicsLibrary((musics) => {
        setList(musics as unknown as string[])
      })
    }
  }, [])
  return (
    <div>
      <button onClick={() => props.setAlbum(null)}>{'<-'}</button>
      <p>{props.album.title}</p>
      <hr />
      {listOfMusic.map((musicName, i) => {
        return (
          <div key={i}>
            <p>{musicName}</p>
          </div>
        )
      })}
    </div>
  )
}

export default Album
