// Import des dépendances
import ErrorCreate from '../libs/Error'
import { ipcMain, IpcMainEvent } from 'electron'
import fs from 'node:fs'
import LibraryManager from '../libs/Library'
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
  const queue: { albumName: string; order: string[]; path: string } = {
    albumName: '',
    order: [],
    path: ''
  }
  // ------------

  /**
   * @dev
   * Permet de lire une musique sur le player.
   * Lance la musique et charge la liste des autres musiques en file d'attente.
   */
  ipcMain.on('action.player.play', (event, args: { album: string; index: number }) => {
    const tracks = library.getTracks(args.album)
    const album = library.get(args.album)
    // --- Verifications 1st step ---
    console.log(tracks)
    if (!tracks || !album) {
      console.error('[ERROR] - Album Inconnu')
      return new ErrorCreate(event).setStatus(1).setMessage('').sendError()
    }
    // -----
    const trackName = tracks[args.index]

    // --- Verifications 2d step ---
    // Vérification de l'existence de l'album
    if (!fs.existsSync(`${album.path}`)) {
      console.error('[ERROR] - Dossier Album Inexistant')
      return new ErrorCreate(event).setStatus(1).setMessage('').sendError()
    }
    // Vérification de l'existence du fichier
    else if (!fs.existsSync(`${album.path}/${trackName}`)) {
      console.log(album.path, trackName, fs.existsSync(`${album.path}/${trackName}`))
      console.error('[ERROR] - Music Inconnu')
      return new ErrorCreate(event).setStatus(1).setMessage('').sendError()
    }

    // --- Get audio file and send to Web ---
    // Audio file
    const audio = fs.readFileSync(`${album.path}/${trackName}`, 'base64')

    // Set Audio Queue
    queue.order = album.tracks
    queue.albumName = album.name
    queue.path = album.path

    // Response
    event.sender.send('action.player.currentTrack', {
      name: trackName,
      audio: `data:audio/mp3;base64,${audio}`,
      index: args.index
    })
  })

  /**
   * Incrémente ou décrémente une variable
   * @param index
   * @param change
   */
  const indexUpdate = (index: number, change: number): number => {
    index += change
    if (index === queue.order.length) {
      return 0
    } else if (index < 0) {
      return queue.order.length - 1
    }
    return index
  }

  /**
   * Checking the queue of album
   * @param index
   * @param change
   * @param event
   */
  const validityFileVerifications = (
    index: number | null,
    change: number,
    event: IpcMainEvent
  ): { name: string; audio: string; index: number } | null => {
    // --- Verification 1st step ---
    // Queue and index arg
    if (queue.albumName === '' || index === null) return null

    // --- Verification 2nd step ---
    // File validity
    index = indexUpdate(index, change)
    while (!fs.existsSync(`${queue.path}/${queue.order[index]}`)) {
      const temp = index
      index = indexUpdate(index, change)

      // Si l'incrémentation est la même,
      // alors il n'y a plus de fichier valide
      if (temp === index) {
        new ErrorCreate(event).setStatus(1).setMessage('').sendError()
        return null
      }
    }

    // --- If all good ---
    // Get Audio File
    const audio = fs.readFileSync(`${queue.path}/${queue.order[index]}`, 'base64')

    // Send the result
    return {
      name: queue.order[index],
      audio: `data:audio/mp3;base64,${audio}`,
      index
    }
  }

  /**
   * @dev
   * 'action.player.nextTrack'
   * @description Lance la musique suivante
   */
  ipcMain.on('action.player.nextTrack', (event, index: number | null) => {
    // --- Verifications ---
    const info = validityFileVerifications(index, 1, event)
    if (!info) return
    // ---------------------

    event.sender.send('action.player.currentTrack', info)
  })

  /**
   * @dev
   * 'action.player.previousTrack`
   * @description Lance la musique précédente
   */
  ipcMain.on('action.player.previousTrack', (event, index: number | null) => {
    // --- Verification ---
    const info = validityFileVerifications(index, 1, event)
    if (!info) return
    // --------------------

    event.sender.send('action.player.currentTrack', info)
  })
}

export default player
