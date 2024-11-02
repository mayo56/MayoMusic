import React, { useEffect } from 'react'
import '@renderer/assets/CSS/Components/TopBar.css' // Icons
import play_icon from '@renderer/assets/Images/play-svgrepo-com (1).svg'
import next_icon from '@renderer/assets/Images/play-skip-forward-svgrepo-com.svg'
import previous_icon from '@renderer/assets/Images/play-skip-back-svgrepo-com.svg'

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
        <audio src={audioSRC} autoPlay={true} ref={audioRef} onTimeUpdate={changeProgressMusic} />
        {/*
        Player controller
        */}

        <img className={'player_icon'} src={previous_icon} alt={'back skip icon'} />

        <img className={'player_icon'} src={play_icon} alt={'play icon'} />

        <img className={'player_icon'} src={next_icon} alt={'next icon'} />

        {/*
        Player Range
        */}
        <span>{audioRef?.current?.currentTime}</span>
        <input type={'range'} value={progress} />
        <span>{audioRef.current?.duration}</span>
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
          <span>Paramètres</span>
        </div>
      </div>
    </div>
  )
}

export default TopBar
