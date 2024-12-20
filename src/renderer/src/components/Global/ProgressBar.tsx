import React, { useEffect, useRef, useState } from 'react'

interface ProgressBarProps {
  audioRef: React.RefObject<HTMLAudioElement>
}

const ProgressBar: React.FC<ProgressBarProps> = ({ audioRef }) => {
  const [progress, setProgress] = useState(0) // Pourcentage de progression
  const [isSliding, setIsSliding] = useState(false) // Si l'utilisateur est en train de slider
  const [isVisible, setIsVisible] = useState(false)
  const progressBarRef = useRef<HTMLDivElement>(null)

  // Met à jour la progression de la barre (lors de la lecture)
  useEffect(() => {
    const audio = audioRef.current
    if (!audio || isSliding) return // Ignore si l'utilisateur est en train de slider

    const updateProgress = (): void => {
      const percentage = (audio.currentTime / audio.duration) * 100
      setProgress(percentage || 0) // Évite les NaN
    }

    audio.addEventListener('timeupdate', updateProgress)
    return (): void => audio.removeEventListener('timeupdate', updateProgress)
  }, [audioRef, isSliding])

  // Commence à slider
  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>): void => {
    setIsSliding(true)
    updateProgressFromEvent(event)
  }

  // Met à jour la barre pendant le déplacement
  const handleMouseMove = (event: MouseEvent): void => {
    if (!isSliding) return
    updateProgressFromEvent(event)
  }

  // Termine le slider
  const handleMouseUp = (): void => {
    if (isSliding) setIsSliding(false)
  }

  // Calcul de la nouvelle position depuis un événement
  const updateProgressFromEvent = (event: { clientX: number }): void => {
    const audio = audioRef.current
    const progressBar = progressBarRef.current

    if (!audio || !progressBar) return

    const rect = progressBar.getBoundingClientRect()
    const clickX = event.clientX - rect.left
    const newProgress = Math.min(Math.max(clickX / rect.width, 0), 1) // Limite entre 0 et 1

    setProgress(newProgress * 100) // Met à jour la progression visuelle
    audio.currentTime = newProgress * audio.duration // Met à jour le temps de lecture
  }

  // Gestion des événements globaux pour le slider
  useEffect(() => {
    if (isSliding) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
    } else {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
    return (): void => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isSliding])

  return (
    <div
      className={'progress-container'}
      onMouseMove={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onMouseDown={handleMouseDown}
    >
      <div ref={progressBarRef} className="progress-bar-container">
        {/* Barre de progression remplie */}
        <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
      </div>
      {/* Curseur (boule) */}
      {isVisible ? (
        <div className="progress-bar-thumb" style={{ left: `${progress}%` }}></div>
      ) : (
        <></>
      )}
    </div>
  )
}

export default ProgressBar
