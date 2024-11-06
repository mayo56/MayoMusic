import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

export type Album = {
  titre: string
  path: string
  cover: undefined | string
}

export type Music = {
  title: string
}

// Custom APIs for renderer
const api = {
  library: {
    // REQ Library list of Albums
    reqAlbums: (): void => {
      ipcRenderer.send('reqAlbums')
    },
    AlbumsList: (callback: (albums: Album[]) => void): void => {
      ipcRenderer.on('AlbumsList', (_, args: Album[]) => callback(args))
    },
    reloadAlbums: (): void => {
      ipcRenderer.send('reloadAlbums')
    },

    // REQ Library list of musics of album
    reqMusics: (albumName: string): void => {
      ipcRenderer.send('reqMusics', albumName)
    },
    MusicsList: (
      callback: (data: { musics: string[]; cover: string | undefined }) => void
    ): void => {
      ipcRenderer.on('MusicsList', (_, args: { musics: string[]; cover: string | undefined }) =>
        callback(args)
      )
    }
  },
  player: {
    // EVENT PLAY MUSIQUE
    playMusic: (album: string, index: number): void => {
      ipcRenderer.send('sendMusic', { album, index })
    },
    receiveMusic: (
      callback: (info: { name: string; audio: string; index: number }) => void
    ): void => {
      ipcRenderer.on('playMusic', (_, args: { name: string; audio: string; index: number }) =>
        callback(args)
      )
    }
  },
  Global: {
    fullscreen: (callback: (fullscreen_status: boolean) => void): void => {
      ipcRenderer.on('fullscreen-status', (_, args: boolean) => callback(args))
    }
  },
  download: {
    yt_dlp_status_req: (): void => {
      ipcRenderer.send('yt-dlp-status:req')
    },
    yt_dlp_status_res: (
      callback: (data: { error: boolean; message: string; version: string }) => void
    ): void => {
      ipcRenderer.on(
        'yt-dlp-status:res',
        (
          _,
          args: {
            error: boolean
            message: string
            version: string
          }
        ) => callback(args)
      )
    },

    yt_dlp_download_req: (data: {
      url: string
      quality: string
      playlist: boolean
      folderName: string
    }): void => {
      ipcRenderer.send('yt-dlp-download:req', data)
    }
  },
  openFolderDialog: async (): Promise<void> => {
    await ipcRenderer.invoke('dialog:openFolder')
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
