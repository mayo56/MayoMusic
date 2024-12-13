import { electronAPI } from '@electron-toolkit/preload'
import { contextBridge, ipcRenderer } from 'electron'
import LibraryAPI from './api/library'
import PlayerAPI from './api/player'

// Custom APIs for renderer
const api = {
  library: LibraryAPI,
  player: PlayerAPI,
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
