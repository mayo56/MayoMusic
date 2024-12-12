// Import des dépendances
import ErrorCreate from '../libs/Error'
import { ipcMain } from 'electron'
import path from 'path'
import LibraryManager from '../libs/Library'
import MusicQueue from '../libs/Queue'
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
  ipcMain.on('action.player.play', (event, args: { albumName: string; title: string }) => {
    const album = library.getAlbum(args.albumName)
    const track = library.getAudioAsBase64(args.albumName, args.title)

    if (!album || !track) {
      return new ErrorCreate(event).setStatus(1).setMessage('').sendError()
    }

    // Set Audio Queue
    queue.clearQueue()
    const index = album.tracks.findIndex((value) => value === args.title)
    for (const audioData in album.tracks) {
      queue.addTrack({
        albumName: args.albumName,
        trackName: audioData,
        path: path.join(album.path, audioData)
      })
    }
    queue.setCurrentTrack(index)

    // Response
    event.sender.send('action.player.currentTrack', {
      name: args.title,
      album,
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
    const audio = library.getAudioAsBase64(trackData.albumName, trackData.trackName)
    if (!audio) return

    event.sender.send('action.player.currentTrack', audio)
  })

  /**
   * @dev
   * 'action.player.previousTrack`
   * @description Lance la musique précédente
   */
  ipcMain.on('action.player.previousTrack', (event) => {
    const trackData = queue.previousTrack()
    if (!trackData) return
    const audio = library.getAudioAsBase64(trackData.albumName, trackData.trackName)
    if (!audio) return

    event.sender.send('action.player.currentTrack', audio)
  })
}

export default player
