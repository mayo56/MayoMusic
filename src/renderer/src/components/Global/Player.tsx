import React from 'react'
import '@renderer/assets/CSS/Global/Player.css'

// Icons
import musicIcon from '@renderer/assets/Images/musical-notes-svgrepo-com.svg'
import skipBackIcon from '@renderer/assets/Images/play-skip-back-svgrepo-com.svg'
import playIcon from '@renderer/assets/Images/play-svgrepo-com (1).svg'
import pauseIcon from '@renderer/assets/Images/pause-svgrepo-com.svg'
import skipForwardIcon from '@renderer/assets/Images/play-skip-forward-svgrepo-com.svg'
import volumeIcon from '@renderer/assets/Images/volume-high-svgrepo-com.svg'

function Player(): React.JSX.Element {
  const [audioSRC, setAudioSRC] = React.useState<string | undefined>(undefined)
  const [isPlaying, setIsPlaying] = React.useState<boolean>(false)
  const [volume, setVolume] = React.useState<number>(50)
  const [progress, setProgress] = React.useState<number>(0)
  const [showVolume, setShowVolume] = React.useState<boolean>(false)
  const [duration, setDuration] = React.useState<string[]>(['00:00', '00:00'])

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
   * Change la progression via les données utilisateurs
   */
  const updateProgress = (): void => {
    if (audioREF.current) {
      // Progress bar
      const currentTime = audioREF.current.currentTime
      const duration = audioREF.current.duration
      setProgress((currentTime / duration) * 100)

      const duration_hours = Math.floor(duration / 3600)
      const current_hours = Math.floor(currentTime / 3600)
      const duration_minutes = Math.floor((duration % 3600) / 60)
      const current_minutes = Math.floor((currentTime % 3600) / 60)
      const duration_secs = Math.floor(duration % 60)
      const current_secs = Math.floor(currentTime % 60)
      setDuration([
        [
          current_hours > 0 ? String(current_hours).padStart(2, '0') : null,
          String(current_minutes).padStart(2, '0'),
          String(current_secs).padStart(2, '0')
        ]
          .filter(Boolean) // Supprime les éléments null (pour ne pas afficher les heures si elles sont à zéro)
          .join(':'),
        [
          duration_hours > 0 ? String(duration_hours).padStart(2, '0') : null,
          String(duration_minutes).padStart(2, '0'),
          String(duration_secs).padStart(2, '0')
        ]
          .filter(Boolean) // Supprime les éléments null (pour ne pas afficher les heures si elles sont à zéro)
          .join(':')
      ])
    }
  }

  // Events
  React.useEffect(() => {
    window.api.player.action.currentTrack((data) => {
      if (audioSRC === data.audio) {
        audioREF.current!.currentTime = 0
        audioREF.current?.play()
      } else {
        setAudioSRC(data.audio)
      }
    })
  }, [])

  return (
    <div className="player-container">
      <audio
        src={audioSRC}
        ref={audioREF}
        autoPlay={true}
        onTimeUpdate={updateProgress}
        onEnded={() => setIsPlaying(false)}
      />

      <div className="player-info">
        <img className="cover" src={musicIcon} alt="Music cover" />
        <div className="info-text">
          <h4 className="title">Titre de la musique</h4>
          <p className="artist">Artiste inconnu</p>
        </div>
      </div>

      <div className="player-controls">
        <img src={skipBackIcon} alt="Skip Back" />

        <img onClick={togglePlay} src={isPlaying ? pauseIcon : playIcon} alt="Play/Pause" />

        <img src={skipForwardIcon} alt="Skip Forward" />
      </div>

      <div className="player-progress">
        <span>
          {duration[0]} - {duration[1]}
        </span>
        <input type="range" value={progress} onChange={handleProgressChange} min="0" max="100" />
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
