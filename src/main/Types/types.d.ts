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

export type AlbumData = {
  name: string
  author: string | null
  tracks: string[] // liste de musiques
  coverPath: string | null // Chemin vers la cover
  path: string
}

export type AlbumConfig = {
  author?: string[]
  cover?: string
  order?: string[]
}
