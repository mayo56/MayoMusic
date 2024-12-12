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

  const audioREF = React.useRef<HTMLAudioElement | null>(null)

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

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const newVolume = Number(e.target.value)
    setVolume(newVolume)
    if (audioREF.current) {
      audioREF.current.volume = newVolume / 100
    }
  }

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const newProgress = Number(e.target.value)
    if (audioREF.current) {
      audioREF.current.currentTime = (audioREF.current.duration * newProgress) / 100
      setProgress(newProgress)
    }
  }

  const updateProgress = (): void => {
    if (audioREF.current) {
      const currentTime = audioREF.current.currentTime
      const duration = audioREF.current.duration
      setProgress((currentTime / duration) * 100)
    }
  }

  // Events
  React.useEffect(() => {
    window.api.player.receiveMusic((data) => {
      setAudioSRC(data.audio)
    })
  }, [])

  return (
    <div className="player-container">
      <audio
        src={audioSRC}
        ref={audioREF}
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
        <span>{Math.floor(progress)}%</span>
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
