import LibraryManager from '../libs/Library'
import { ipcMain } from 'electron'
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
  ipcMain.on('request.musics', (event, args: string): void => {
    const album = library.getAlbumTracks(args)

    // Vérifications
    if (!album) {
      return new ErrorCreate(event).setStatus(1).setMessage('').sendError()
    }

    // Envoi de la réponse
    event.sender.send('response.musicsList', {
      musics: album.tracks,
      cover: album.coverPath
    })
  })
}

export default data
