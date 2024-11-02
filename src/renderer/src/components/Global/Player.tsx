// React Import
import React from 'react'

// CSS
// In SideBar.css
// Icons
import fullscreen_music_icon from '@renderer/assets/Images/resize-svgrepo-com.svg'
import skip_back_icon from '@renderer/assets/Images/play-skip-back-svgrepo-com.svg'
import play_icon from '@renderer/assets/Images/play-svgrepo-com (1).svg'
import skip_forward_con from '@renderer/assets/Images/play-skip-forward-svgrepo-com.svg'
import volume_icon from '@renderer/assets/Images/volume-high-svgrepo-com.svg'

function Player(): React.JSX.Element {
  // -- Audio parameters --
  const [audioSRC, setAudioSRC] = React.useState<string | undefined>(undefined)
  const audioREF = React.useRef<HTMLAudioElement | null>(null)
  // Events audio
  React.useEffect(() => {
    window.api.player.receiveMusic((audio) => {
      setAudioSRC(audio)
      console.log('audio ', audio)
    })
  }, [])

  // -- Show Informations --
  const [showInfo, setShowInfo] = React.useState<boolean>(false)
  const [progressBar, setProgressBar] = React.useState<number>(0)
  // Formatage des timestamps de musique (player)
  const formatDuration = (duration: number | undefined): string => {
    if (duration) {
      const hours = Math.floor(duration / 3600)
      const minutes = Math.floor((duration % 3600) / 60)
      const secs = Math.floor(duration % 60)

      return [
        hours > 0 ? String(hours).padStart(2, '0') : null, // Affiche les heures seulement si elles sont présentes
        String(minutes).padStart(2, '0'),
        String(secs).padStart(2, '0')
      ]
        .filter(Boolean) // Supprime les éléments null (pour ne pas afficher les heures si elles sont à zéro)
        .join(':')
    } else {
      return '0:00'
    }
  }
  const UpdateTime = (): void => {
    if (audioREF.current) {
      // Progress Bar
      const current = audioREF.current.currentTime
      const duration = audioREF.current.duration
      setProgressBar((current / duration) * 100)
    } else {
      setProgressBar(0)
    }
  }

  // Volume control
  const [showVolume, setShowVolume] = React.useState<boolean>(false)
  return (
    <div
      className={'player_Container'}
      onMouseMove={() => setShowInfo(true)}
      onMouseLeave={() => setShowInfo(false)}
    >
      {/*
      Balise audio
      */}
      <audio src={audioSRC} ref={audioREF} onTimeUpdate={UpdateTime} autoPlay />

      <div className={`player_info ${showInfo ? 'show' : 'hide'}`}>
        <p>Aucune musique</p>
        <div className={'timer'}>
          <span>{formatDuration(audioREF.current?.currentTime)}</span>
          <span>{formatDuration(audioREF.current?.duration)}</span>
        </div>
        <input value={progressBar} type={'range'} />
      </div>

      {/* Play controller, Volume controller */}
      <div className={'play_controller'}>
        <img
          src={fullscreen_music_icon}
          alt={'fullscreen music icon'}
          className={'incoming_feature'}
        />
        <img src={skip_back_icon} alt={'skip back icon'} />
        <img
          onClick={() => window.api.player.playMusic('Spice & Wolf', 'Ulv.opus')}
          src={play_icon}
          alt={'play icon'}
        />
        <img src={skip_forward_con} alt={'skip forward icon'} />
        <img
          onClick={() => setShowVolume((state) => !state)}
          src={volume_icon}
          alt={'volume icon'}
        />
      </div>

      {/*
      Volume controller
      */}
      <div className={showVolume ? 'volume show' : 'volume hide'}>
        <input
          onChange={(e) => (audioREF.current!.volume = Number(e.target.value))}
          type={'range'}
          value={audioREF.current?.volume}
        />
      </div>
    </div>
  )
}

export default Player
