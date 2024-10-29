import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

export type Album = {
  titre: string
  path: string
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
      ipcRenderer.send('reqAlbums', albumName)
    },
    MusicsList: (callback: (music: Music[]) => void): void => {
      ipcRenderer.on('MusicsList', (_, args: Music[]) => callback(args))
    }
  },
  openFolderDialog: async (): Promise<null> => await ipcRenderer.invoke('dialog:openFolder')
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
