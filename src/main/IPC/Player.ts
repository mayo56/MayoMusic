// Import des dépendances
import LibraryManager from '../libs/Library'
import ErrorCreate from '../libs/Error'
import MusicQueue from '../libs/Queue'
import { ipcMain } from 'electron'
import path from 'path'
// ---------------------

//  --- GLOBAL VARIABLE ---
const library = LibraryManager.getInstance()
// ------------------------

/**
 * @dev
 * Handler de tous les évènements sur le player
 */
const player = (): void => {
  // ------------------------------------------------------------------------------- //
  //                                EVENT PLAYER                                     //
  // ------------------------------------------------------------------------------- //
  // ------------
  // File d'attente de musique
  const queue = new MusicQueue()
  // ------------

  /**
   * @dev
   * Permet de lire une musique sur le player.
   * Lance la musique et charge la liste des autres musiques en file d'attente.
   */
  ipcMain.on('action.player.play', (event, data: { albumName: string; trackName: string }) => {
    const album = library.getAlbum(data.albumName)
    const track = library.getAudioAsBase64(data.albumName, data.trackName)

    if (!album || !track) {
      return new ErrorCreate(event).setStatus(1).setMessage('').sendError()
    }

    // Set Audio Queue
    queue.clearQueue()
    const index = album.tracks.findIndex((value) => value === data.trackName)
    for (const audioData of album.tracks) {
      queue.addTrack({
        albumName: data.albumName,
        trackName: audioData,
        path: path.join(album.path, audioData)
      })
    }
    queue.setCurrentTrack(index)

    // Response
    event.sender.send('action.player.currentTrack', {
      album,
      trackName: data.trackName,
      audio: track
    })
  })

  /**
   * @dev
   * 'action.player.nextTrack'
   * @description Lance la musique suivante
   */
  ipcMain.on('action.player.nextTrack', (event) => {
    const trackData = queue.nextTrack()
    if (!trackData) return
    const album = library.getAlbum(trackData.albumName)
    const audio = library.getAudioAsBase64(trackData.albumName, trackData.trackName)
    if (!audio || !album) return

    event.sender.send('action.player.currentTrack', {
      album,
      trackName: trackData.trackName,
      audio
    })
  })

  /**
   * @dev
   * 'action.player.previousTrack`
   * @description Lance la musique précédente
   */
  ipcMain.on('action.player.previousTrack', (event) => {
    const trackData = queue.previousTrack()
    if (!trackData) return
    const album = library.getAlbum(trackData.albumName)
    const audio = library.getAudioAsBase64(trackData.albumName, trackData.trackName)
    if (!audio || !album) return

    event.sender.send('action.player.currentTrack', {
      album,
      trackName: trackData.trackName,
      audio
    })
  })
}

export default player
