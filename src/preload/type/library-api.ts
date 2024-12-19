import { AlbumData, MusicResponseData } from './Types'
import { IpcRenderer } from 'electron'

interface LibraryAPI {
  request: {
    /**
     * Requête pour demander la liste des albums
     */
    album(): void
    /**
     * Requête pour demander la liste des musiques d'un album
     */
    music(albumName: string): void
  }
  response: {
    /**
     * Listener data response de la liste d'album
     * @param callback
     */
    albums(callback: (albums: AlbumData[]) => void): () => IpcRenderer
    /**
     * Listener data response de la liste de musique d'un album
     * @param callback
     */
    musics(callback: (data: MusicResponseData) => void): () => IpcRenderer
  }
  data: {
    /**
     * Listener data invoke pour récupérer la data d'une cover d'album
     * @param albumName
     */
    cover(albumName: string): Promise<string | undefined>

    /**
     * Listener data invoke pour récupérer les infos sur un album
     * @param albumName
     */
    album(albumName: string): Promise<AlbumData | null>

    /**
     * Requête pour demander le reload des albums
     */
    reload(): Promise<void>
  }
}

export default LibraryAPI
