import React from 'react'
import '@renderer/assets/CSS/Global/Player.css'

// Icons
import musicIcon_black from '@renderer/assets/Images/musicIcon_black.svg'
import musicIcon_white from '@renderer/assets/Images/musicIcon_white.svg'
import skipBackIcon from '@renderer/assets/Images/play-skip-back-svgrepo-com.svg'
import playIcon from '@renderer/assets/Images/play-svgrepo-com (1).svg'
import pauseIcon from '@renderer/assets/Images/pause-svgrepo-com.svg'
import skipForwardIcon from '@renderer/assets/Images/play-skip-forward-svgrepo-com.svg'
import volumeIcon from '@renderer/assets/Images/volume-high-svgrepo-com.svg'

export type AlbumData = {
  name: string
  author: string | null
  tracks: string[]
  coverPath: string | null
  path: string
}

function Player(): React.JSX.Element {
  const [audioSRC, setAudioSRC] = React.useState<string | undefined>(undefined)
  const [isPlaying, setIsPlaying] = React.useState<boolean>(false)
  const [volume, setVolume] = React.useState<number>(50)
  const [progress, setProgress] = React.useState<number>(0)
  const [showVolume, setShowVolume] = React.useState<boolean>(false)
  const [duration, setDuration] = React.useState<string[]>(['00:00', '00:00'])
  const [trackData, setTrackData] = React.useState<{ albumData: AlbumData; trackName: string }>({
    albumData: { author: 'Artiste Inconnue', name: 'Inconnu', tracks: [], coverPath: '', path: '' },
    trackName: 'Aucun son'
  })
  const [cover, setCover] = React.useState<string | undefined>(undefined)

  const audioREF = React.useRef<HTMLAudioElement | null>(null)

  /**
   * Contrôle la lecture du média
   */
  const togglePlay = (): void => {
    if (audioREF.current) {
      if (isPlaying) {
        audioREF.current.pause()
      } else {
        audioREF.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  /**
   * Contrôle la variation de volume
   * @param e
   */
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const newVolume = Number(e.target.value)
    setVolume(newVolume)
    if (audioREF.current) {
      audioREF.current.volume = newVolume / 100
    }
  }

  /**
   * Change la progression de la barre de progression
   * @param e
   */
  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const newProgress = Number(e.target.value)
    if (audioREF.current) {
      audioREF.current.currentTime = (audioREF.current.duration * newProgress) / 100
      setProgress(newProgress)
    }
  }

  /**
   * Formateur de temps
   * @param time Temps à former
   * @return {string} Format de temps en hh: mm: ss
   */
  const formatTime = (time: number): string => {
    if (isNaN(time)) return '00:00'

    const hours = Math.floor(time / 3600)
    const minutes = Math.floor((time % 3600) / 60)
    const seconds = Math.floor(time % 60)

    return [
      hours > 0 ? String(hours).padStart(2, '0') : null, // Affiche les heures seulement si elles sont > 0
      String(minutes).padStart(2, '0'),
      String(seconds).padStart(2, '0')
    ]
      .filter(Boolean) // Supprime les heures si elles sont null
      .join(':')
  }

  /**
   * Change la progression via les données utilisateurs
   */
  const updateProgress = (): void => {
    if (!audioREF.current) return

    const { currentTime, duration } = audioREF.current

    // Met à jour la barre de progression
    setProgress((currentTime / duration) * 100 || 0)

    // Met à jour les durées formatées
    setDuration([formatTime(currentTime), formatTime(duration)])
  }

  // Events
  React.useEffect(() => {
    window.api.player.action.currentTrack((data) => {
      const trackName = data.trackName.split('.')
      if (trackName.length > 0) trackName.pop()
      setTrackData({ albumData: data.album, trackName: trackName.join('.') })
      if (audioREF.current?.src === data.audio) {
        audioREF.current!.currentTime = 0
        audioREF.current?.play()
      } else {
        setAudioSRC(data.audio)
      }
      // ajout de la cover
      window.api.library.data.cover(data.album.name).then((coverData) => {
        setCover(coverData)
        // --- MediaSession ---
        if ('mediaSession' in navigator) {
          console.info('[INFO] - MediaSession mis à jour.')
          navigator.mediaSession.metadata = new MediaMetadata({
            title: trackName.join('.'),
            artist: data.album.author ?? 'Aucun',
            album: data.album.name,
            artwork: [
              { sizes: '512/512', src: coverData ?? musicIcon_black, type: 'image/png' }
            ]
          })
        }
        // Play
        navigator.mediaSession.setActionHandler('play', () => togglePlay())
        // Next Track
        navigator.mediaSession.setActionHandler('nexttrack', () =>
          window.api.player.action.nextTrack()
        )
        // Previous Track
        navigator.mediaSession.setActionHandler('previoustrack', () =>
          window.api.player.action.previousTrack()
        )
        // -------------------
      })
    })
  }, [])

  return (
    <div className="player-container">
      <audio
        src={audioSRC}
        ref={audioREF}
        autoPlay={true}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={updateProgress}
        onEnded={() => window.api.player.action.nextTrack()}
      />

      <div className="player-info">
        <img className="cover" src={cover ? cover : musicIcon_white} alt="Music cover" />
        <div className="info-text">
          <h4 className="title">{trackData.trackName}</h4>
          <p className="artist">{trackData.albumData.author}</p>
        </div>
      </div>

      <div className={'player-controls-container'}>
        <div className="player-controls">
          <img
            onClick={() => window.api.player.action.previousTrack()}
            src={skipBackIcon}
            alt="Skip Back"
          />

          <img onClick={togglePlay} src={isPlaying ? pauseIcon : playIcon} alt="Play/Pause" />

          <img
            onClick={() => window.api.player.action.nextTrack()}
            src={skipForwardIcon}
            alt="Skip Forward"
          />
        </div>

        <div className="player-progress">
          <span>{duration[0]}</span>
          <input type="range" value={progress} onChange={handleProgressChange} min="0" max="100" />
          <span>{duration[1]}</span>
        </div>
      </div>

      <div className="volume-container">
        <button onClick={() => setShowVolume(!showVolume)}>
          <img src={volumeIcon} alt="Volume" />
        </button>
        {showVolume && (
          <input type="range" value={volume} onChange={handleVolumeChange} min="0" max="100" />
        )}
      </div>
    </div>
  )
}

export default Player
