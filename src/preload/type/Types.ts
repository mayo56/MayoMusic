export type trackType = string[]
export type nameType = string
export type authorType = string | null
export type coverPathType = string | null
export type pathType = string

/**
 * Type data pour les albums
 */
export type AlbumData = {
  name: nameType
  author: authorType
  tracks: trackType
  coverPath: coverPathType
  path: pathType
}

/**
 * Type de data retour des listes de musiques
 */
export type MusicResponseData = {
  album: AlbumData
  tracks: trackType
}

/**
 * Type de data retour des musiques (player)
 */
export type TrackResponseType = {
  album: AlbumData
  trackName: nameType
  audio: string
}
