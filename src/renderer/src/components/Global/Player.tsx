// React Import
import React from 'react'

// CSS
import '@renderer/assets/CSS/Global/Player.css'

// Icons
import music_icon from '@renderer/assets/Images/musical-notes-svgrepo-com.svg'
import skip_back_icon from '@renderer/assets/Images/play-skip-back-svgrepo-com.svg'
import play_icon from '@renderer/assets/Images/play-svgrepo-com (1).svg'
import pause_icon from '@renderer/assets/Images/pause-svgrepo-com.svg'
import skip_forward_con from '@renderer/assets/Images/play-skip-forward-svgrepo-com.svg'
import volume_icon from '@renderer/assets/Images/volume-high-svgrepo-com.svg'

function Player(): React.JSX.Element {
  // -- Audio parameters --
  const [audioSRC, setAudioSRC] = React.useState<string | undefined>(undefined)
  const audioREF = React.useRef<HTMLAudioElement | null>(null)
  const [audioINFO, setAudioINFO] = React.useState<{ name: string; index: null | number }>({
    name: 'Aucune musique',
    index: null
  })
  // Events audio
  React.useEffect(() => {
    window.api.player.receiveMusic((info) => {
      if (audioREF.current?.src === info.audio) {
        audioREF.current.currentTime = 0
        audioREF.current.play()

        if ('mediaSession' in navigator) {
          navigator.mediaSession.metadata = new MediaMetadata({
            title: 'Ma Meilleure Ennemie',
            artist: 'Stromae, Pomme',
            album: 'Arcane Season 2 Soundtrack',
            artwork: [
              { src: 'https://example.com/image-96x96.jpg', sizes: '96x96', type: 'image/jpeg' },
              {
                src: 'https://example.com/image-128x128.jpg',
                sizes: '128x128',
                type: 'image/jpeg'
              },
              { src: 'https://example.com/image-192x192.jpg', sizes: '192x192', type: 'image/jpeg' }
            ]
          })
        }
      } else {
        setAudioSRC(info.audio)
        const audioName = info.name.split('.')
        audioName.pop()
        setAudioINFO({
          name: audioName.join('.'),
          index: info.index
        })
        console.warn(info)
      }
    })
  }, [])

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

  // Volume
  const [volume, setVolume] = React.useState<number>(100)
  const volumeChange = (vol: number): void => {
    setVolume(vol)
    if (audioREF.current) {
      audioREF.current.volume = vol / 100
    }
  }

  // Current time (progress bar)
  const [progressBar, setProgressBar] = React.useState<number>(0)
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

  const UserChangeTime = (time: number): void => {
    if (audioREF.current) {
      audioREF.current.currentTime = (time / 100) * audioREF.current.duration
    }
  }

  // Play
  const [isPlaying, setIsPlaying] = React.useState<boolean>(false)
  const controlPlaying = (): void => {
    if (audioREF.current) {
      if (audioREF.current.paused) {
        audioREF.current.play().then(() => setIsPlaying(true))
      } else {
        audioREF.current.pause()
      }
    }
  }

  const [showVolume, setShowVolume] = React.useState<boolean>(false)
  return (
    <div className={'player-container'}>
      {/*
      Balise audio
      */}
      <audio
        onPause={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
        onEnded={() => window.api.player.nextMusic(audioINFO.index)}
        src={audioSRC}
        ref={audioREF}
        onTimeUpdate={UpdateTime}
        autoPlay
      />

      {/*
      Player info
      */}

      <div className={`player-info`}>
        <div className={'player-cover-container'}>
          <img className={'cover'} src={music_icon} alt={'music cover'} />
        </div>
        <div className={'player-data-origin-container'}>
          <div>
            <span className={'title'}>{audioINFO.name}</span>
          </div>
          <div>
            <span className={'author'}>Author</span>
          </div>
        </div>
      </div>

      {/* Play controller, Volume controller */}
      <div className={'play-controller'}>
        <div>
          <img
            onClick={() => window.api.player.previousMusic(audioINFO.index)}
            src={skip_back_icon}
            alt={'skip back icon'}
          />
          <img
            onClick={controlPlaying}
            src={isPlaying ? pause_icon : play_icon}
            alt={'play icon'}
          />
          <img
            onClick={() => window.api.player.nextMusic(audioINFO.index)}
            src={skip_forward_con}
            alt={'skip forward icon'}
          />
          <img
            onClick={() => setShowVolume((state) => !state)}
            src={volume_icon}
            alt={'volume icon'}
          />
        </div>

        <div className={'player-progress'}>
          <span>{formatDuration(audioREF.current?.currentTime)}</span>
          {/*
        Progress bar de la musique en cours
        */}
          <input
            value={progressBar}
            min={0}
            max={100}
            onChange={(e) => UserChangeTime(Number(e.target.value))}
            type={'range'}
          />
          <span>{formatDuration(audioREF.current?.duration)}</span>
        </div>
      </div>

      {/*
      Volume controller
      */}
      <div className={showVolume ? 'volume show' : 'volume hide'}>
        <input
          onChange={(e) => volumeChange(Number(e.target.value))}
          type={'range'}
          value={volume}
          min={0}
          max={100}
        />
      </div>
    </div>
  )
}

export default Player
