import { ipcMain, IpcMainEvent, IpcMainInvokeEvent } from 'electron'
import LibraryManager from '../libs/Library'
import { AlbumData } from '../Types/types'
import ErrorCreate from '../libs/Error'
import Listeners from '../libs/Listeners'

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
  ipcMain.on(Listeners.library.request.album, (event): void => {
    event.sender.send(Listeners.library.response.album, library.getAlbums())
  })

  /**
   * @dev
   * Requête pour demander la liste des musiques d'un album.
   * Renvoi un 'response.musicsList' avec la liste des musiques de l'album.
   */
  ipcMain.on(Listeners.library.request.music, (event, albumName: string): void => {
    const album = library.getAlbum(albumName)

    // Vérifications
    if (!album) {
      return new ErrorCreate(event).setStatus(1).setMessage('').sendError()
    }

    // Envoi de la réponse
    event.sender.send(Listeners.library.response.music, {
      album,
      tracks: album.tracks
    })
  })

  /**
   * Requête pour récupérer la data image (cover) d'un album
   */
  ipcMain.handle(Listeners.library.data.cover, (_, albumName: string): undefined | string => {
    const album = library.getAlbum(albumName)

    // Checking
    if (!album) return undefined

    return library.getCoverAsBase64(album.name)
  })

  /**
   * Requête pour récupérer la data d'un album
   */
  ipcMain.handle(
    Listeners.library.data.album,
    (_: IpcMainInvokeEvent, albumName: string): null | AlbumData => {
      return library.getAlbum(albumName)
    }
  )

  /**
   * Requête pour recharger les albums
   */
  ipcMain.on(Listeners.library.data.reload, (event: IpcMainEvent) => {
    library
      .initializeLibrary()
      .then(() => {
        event.sender.send(Listeners.library.response.album, library.getAlbums())
      })
      .catch((err) => console.error(err))
  })
}

export default data
