export type settings = {
  settings: {
    savePath: string
  }
}

export type Music = {
  title: string
  path: string
  cover: undefined | string
  order: undefined | string[]
}

export type music_setting = {
  cover: string
  order: undefined | string[]
}
