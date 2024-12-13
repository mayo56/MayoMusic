import { TrackResponseType } from '../type/Types'
import { ipcRenderer } from 'electron'
import Listeners from '../Listeners'

const PlayerAPI = {
  action: {
    /**
     * @player
     * Requête pour lancer une musique
     * @param albumName Nom de l'album
     * @param trackName Nom de la musique
     */
    play: (albumName: string, trackName: string): void => {
      ipcRenderer.send(Listeners.player.action.play, { albumName, trackName })
    },
    /**
     * @player
     * Listener pour récupérer la data de la musique courant joué
     * @param callback data sur la musique jouée (callback)
     */
    currentTrack: (callback: (info: TrackResponseType) => void): void => {
      ipcRenderer.on(Listeners.player.action.currentTrack, (_, args: TrackResponseType) =>
        callback(args)
      )
    },
    /**
     * @player
     * Requête pour passe à la musique suivante
     */
    nextTrack: (): void => {
      ipcRenderer.send(Listeners.player.action.nextTrack)
    },
    /**
     * @player
     * Requête pour passe à la musique précédente
     */
    previousTrack: (): void => {
      ipcRenderer.send(Listeners.player.action.previousTrack)
    }
  }
}

export default PlayerAPI
