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
