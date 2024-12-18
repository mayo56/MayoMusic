// Dépendances
import { ipcRenderer, IpcRenderer, IpcRendererEvent } from 'electron'
import { AlbumData, MusicResponseData } from '../type/Types'
import Listeners from '../Listeners'
// -------------

/**
 * Liste des différentes API pour la library
 */
const LibraryAPI = {
  request: {
    /**
     * Requête pour demander la liste des albums
     */
    album: (): void => {
      ipcRenderer.send(Listeners.library.request.album)
    },
    /**
     * Requête pour demander la liste des musiques d'un album
     */
    music: (albumName: string): void => {
      ipcRenderer.send(Listeners.library.request.music, albumName)
    }
  },
  response: {
    /**
     * Listener data response de la liste d'album
     * @param callback
     */
    albums: (callback: (albums: AlbumData[]) => void): (() => Electron.IpcRenderer) => {
      const listener = (_: IpcRendererEvent, data: AlbumData[]): void => {
        callback(data)
      }
      ipcRenderer.on(Listeners.library.response.album, listener)

      return (): IpcRenderer =>
        ipcRenderer.removeListener(Listeners.library.response.album, listener)
    },
    /**
     * Listener data response de la liste de musique d'un album
     * @param callback
     */
    musics: (callback: (data: MusicResponseData) => void): (() => Electron.IpcRenderer) => {
      const listener = (_: IpcRendererEvent, data: MusicResponseData): void => {
        callback(data)
      }
      ipcRenderer.on(Listeners.library.response.music, listener)

      return () => ipcRenderer.removeListener(Listeners.library.response.music, listener)
    }
  },
  data: {
    /**
     * Listener data invoke pour récupérer la data d'une cover d'album
     * @param albumName
     */
    cover: async (albumName: string): Promise<string | undefined> => {
      return await ipcRenderer.invoke(Listeners.library.data.cover, albumName)
    },

    /**
     * Listener data invoke pour récupérer les infos sur un album
     * @param albumName
     */
    album: async (albumName: string): Promise<AlbumData | null> => {
      return await ipcRenderer.invoke(Listeners.library.data.album, albumName)
    },

    /**
     * Requête pour demander le reload des albums
     */
    reload: async (): Promise<void> => {
      ipcRenderer.send(Listeners.library.data.reload)
    }
  }
}

export default LibraryAPI
