import { TrackResponseType } from './Types'

interface PlayerAPI {
  action: {
    /**
     * @player
     * Requête pour lancer une musique
     * @param albumName Nom de l'album
     * @param trackName Nom de la musique
     */
    play(albumName: string, trackName: string): void
    /**
     * @player
     * Listener pour récupérer la data de la musique courant joué
     * @param callback data sur la musique jouée (callback)
     */
    currentTrack(callback: (info: TrackResponseType) => void): void
    /**
     * @player
     * Requête pour passe à la musique suivante
     */
    nextTrack(): void
    /**
     * @player
     * Requête pour passe à la musique précédente
     */
    previousTrack(): void
  }
}

export default PlayerAPI
