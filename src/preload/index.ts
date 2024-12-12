import Electron, { contextBridge, IpcRenderer, ipcRenderer, IpcRendererEvent } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

const Listeners = {
  request: {
    albums: 'request.albums',
    musics: 'request.musics',
    cover: 'request.album.cover'
  },
  response: {
    albums: 'response.albums',
    musics: 'response.musics'
  }
}

export type Album = {
  title: string
  path: string
  cover: undefined | string
  author: string
}

export type Music = {
  title: string
}

// Custom APIs for renderer
const api = {
  library: {
    request: {
      albums: (): void => {
        ipcRenderer.send('request.albums')
      },
      musics: (albumName: string): void => {
        ipcRenderer.send('request.musics', albumName)
      },
      cover: async (albumName: string): Promise<string | undefined> => {
        return await ipcRenderer.invoke('request.album.cover', albumName)
      }
    },
    response: {
      albums: (callback: (albums: Album[]) => void): (() => Electron.IpcRenderer) => {
        const listener = (_: IpcRendererEvent, data: Album[]): void => {
          callback(data)
        }
        ipcRenderer.on('response.albumsList', listener)

        return (): IpcRenderer => ipcRenderer.removeListener('response.albumsList', listener)
      },
      musics: (
        callback: (data: { musics: string[]; cover: string | undefined }) => void
      ): (() => Electron.IpcRenderer) => {
        const listener = (
          _: IpcRendererEvent,
          data: { musics: string[]; cover: string | undefined }
        ): void => {
          callback(data)
        }
        ipcRenderer.on('response.musicsList', listener)

        return () => ipcRenderer.removeListener('response.musicsList', listener)
      }
    },

    removeListener: {
      albums: (data): void => {
        ipcRenderer.removeListener(Listeners.response.albums, data)
      }
    },

    // File
    openMusicFolder: (albumName: string): void => {
      ipcRenderer.send('OpenAlbumDirectory', albumName)
    }
  },
  player: {
    // EVENT PLAY MUSIQUE
    playMusic: (album: string, index: number): void => {
      ipcRenderer.send('sendMusic', { album, index })
    },
    // Reception de la musique
    receiveMusic: (
      callback: (info: { name: string; audio: string; index: number | null }) => void
    ): void => {
      ipcRenderer.on('playMusic', (_, args: { name: string; audio: string; index: number }) =>
        callback(args)
      )
    },

    // nextMusic
    nextMusic: (index: number | null): void => {
      ipcRenderer.send('nextMusic', index)
    },
    // previousMusic
    previousMusic: (index: number | null): void => {
      ipcRenderer.send('previousMusic', index)
    }
  },
  download: {
    /**
     * @deprecated
     */
    yt_dlp_status_req: (): void => {
      ipcRenderer.send('yt-dlp-status:req')
    },
    /**
     * @deprecated
     * @param callback
     */
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

    /**
     * @deprecated
     * @param data
     */
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
