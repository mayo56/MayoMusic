import { QueueState, QueueTrack } from '../Types/types'

class MusicQueue {
  private queue: QueueState

  constructor() {
    this.queue = {
      tracks: [],
      currentIndex: -1 // Aucun élément actif par défaut
    }
  }

  /** Ajoute une piste à la fin de la queue */
  public addTrack(track: QueueTrack): void {
    this.queue.tracks.push(track)
  }

  /** Retire la piste en tête */
  public removeTrack(index: number): QueueTrack | null {
    if (index >= 0 && index < this.queue.tracks.length) {
      return this.queue.tracks.splice(index, 1)[0]
    }
    return null
  }

  public getIndex(): number {
    return this.queue.currentIndex
  }

  /** Set l'index de queue */
  public setCurrentTrack(index: number): QueueTrack | null {
    if (index >= 0 && index < this.queue.tracks.length) {
      this.queue.currentIndex = index
      return this.getCurrentTrack()
    }
    return null
  }

  /** Passe à la piste suivante */
  public nextTrack(): QueueTrack | null {
    if (this.queue.currentIndex < this.queue.tracks.length - 1) {
      this.queue.currentIndex++
      return this.getCurrentTrack()
    } else {
      this.queue.currentIndex = 0
      return this.getCurrentTrack()
    }
  }

  /** Reviens à la piste précédente */
  public previousTrack(): QueueTrack | null {
    if (this.queue.currentIndex > 0) {
      this.queue.currentIndex--
      return this.getCurrentTrack()
    } else {
      this.queue.currentIndex = this.queue.tracks.length - 1
      return this.getCurrentTrack()
    }
  }

  /** Obtenir la piste en cours */
  public getCurrentTrack(): QueueTrack | null {
    if (this.queue.currentIndex >= 0 && this.queue.currentIndex < this.queue.tracks.length) {
      return this.queue.tracks[this.queue.currentIndex]
    }
    return null
  }

  /** Réinitialise la queue */
  public clearQueue(): void {
    this.queue.tracks = []
    this.queue.currentIndex = -1
  }

  /** Obtenir toute la queue */
  public getQueue(): QueueTrack[] {
    return this.queue.tracks
  }
}

export default MusicQueue
