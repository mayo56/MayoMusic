import React, { useEffect } from 'react'
import '@renderer//assets/Components/TopBar.css'

function TopBar(props: { menu: number; setMenu: any }): React.JSX.Element {
  const changeMenu = (to: number): void => props.setMenu(to)

  // PLAYER
  const [audioSRC, setAudioSRC] = React.useState<string | undefined>(undefined)
  const audioRef = React.useRef<null | HTMLAudioElement>(null)
  useEffect(() => {
    return (): void => {
      window.api.player.receiveMusic((audio) => {
        setAudioSRC(audio)
        console.warn(audio)
      })
    }
  }, [])
  // CONTROLLER
  const [progress, setProgress] = React.useState<number>(0)
  const changeProgressMusic = (): void => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime
      const duration = audioRef.current.duration
      setProgress((current / duration) * 100)
    }
  }
  return (
    <div className={'topBarContainer'}>
      <div className={'topBarPlayer'}>
        <audio
          src={audioSRC}
          autoPlay={true}
          ref={audioRef}
          onTimeUpdate={changeProgressMusic}
        />
        <button>{'<-'}</button>
        <button>{' P'}</button>
        <button>{'->'}</button>
        <input type={'range'} value={progress} />
      </div>
      <div className={'topBarSpacesButtonsContainer'}>
        <div
          onClick={() => changeMenu(0)}
          className={props.menu == 0 ? 'topBarButton selected' : 'topBarButton'}
        >
          <span>Bibliothèque</span>
        </div>
        <div className={'separator'}>|</div>
        <div
          onClick={() => changeMenu(1)}
          className={props.menu == 1 ? 'topBarButton selected' : 'topBarButton'}
        >
          <span>Download</span>
        </div>
      </div>
    </div>
  )
}

export default TopBar
