import { ipcMain, IpcMainInvokeEvent } from 'electron'
import LibraryManager from '../libs/Library'
import { AlbumData } from '../Types/types'
import ErrorCreate from '../libs/Error'

// --- GLOBAL VARIABLE ---
const library = LibraryManager.getInstance()
// -----------------------

const data = (): void => {
  // ------------------------------------------------------------------------------- //
  //                              ALBUM/MUSICS DATA                                  //
  // ------------------------------------------------------------------------------- //

  /**
   * @dev
   * Requête pour demander la liste des albums présente dans le dossier musiques.
   * Renvoi un 'response.albumsList' avec la liste des albums.
   */
  ipcMain.on('request.albums', (event): void => {
    event.sender.send('response.albumsList', library.getAlbums())
  })

  /**
   * @dev
   * Requête pour demander la liste des musiques d'un album.
   * Renvoi un 'response.musicsList' avec la liste des musiques de l'album.
   */
  ipcMain.on('request.musics', (event, albumName: string): void => {
    const album = library.getAlbum(albumName)

    // Vérifications
    if (!album) {
      return new ErrorCreate(event).setStatus(1).setMessage('').sendError()
    }

    // Envoi de la réponse
    event.sender.send('response.musicsList', {
      album,
      tracks: album.tracks
    })
  })

  /**
   * Requête pour récupérer la data image (cover) d'un album
   */
  ipcMain.handle('request.album.cover', (_, albumName: string): undefined | string => {
    const album = library.getAlbum(albumName)

    // Checking
    if (!album) return undefined

    return library.getCoverAsBase64(album.name)
  })

  /**
   * Requête pour récupérer la data d'un album
   */
  ipcMain.handle(
    'request.album.data',
    (_: IpcMainInvokeEvent, albumName: string): null | AlbumData => {
      return library.getAlbum(albumName)
    }
  )
}

export default data
