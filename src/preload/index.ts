import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

export type Music = {
  titre: string
  path: string
}

// Custom APIs for renderer
const api = {
  library: {
    req: (): void => {
      ipcRenderer.send('reqMusics')
    },
    MusicLibrary: (callback: (musics: Music[]) => void): void => {
      ipcRenderer.on('MusicLibrary', (_, args: Music[]) => callback(args))
    },
    reloadList: (): void => {
      ipcRenderer.send('reloadMusics')
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
