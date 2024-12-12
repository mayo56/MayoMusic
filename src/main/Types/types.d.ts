export type settings = {
  settings: {
    savePath: string
  }
}

export type Music = {
  title: string
  path: string
  author: string | null
  cover: undefined | string
  order: string[]
}

export type music_setting = {
  cover: string
  author: string[]
  order: undefined | string[]
}

// DATA
/**
 * Type des data brutes d'un album
 */
export type AlbumData = {
  name: string
  author: string | null
  tracks: string[] // liste de musiques
  coverPath: string | null // Chemin vers la cover
  path: string
}

/**
 * Type des data brutes du JSON d'un album
 */
export type AlbumConfig = {
  author?: string[]
  cover?: string
  order?: string[]
}

// PLAYER
/**
 * Type des data des musiques de la file d'attente
 */
export type QueueTrack = {
  albumName: string
  trackName: string
  path: string
}

/**
 * Type status de la file d'attente
 */
export type QueueState = {
  tracks: QueueTrack[]
  currentIndex: number
}
