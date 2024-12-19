/**
 * Liste de tous les évènements de l'application
 */
const Listeners = {
  library: {
    request: {
      album: 'request.albums',
      music: 'request.musics'
    },
    response: {
      album: 'response.albumsList',
      music: 'response.musicsList'
    },
    data: {
      cover: 'request.album.cover',
      album: 'request.album.data',
      reload: 'request.album.reload'
    }
  },
  player: {
    action: {
      play: 'action.player.play',
      nextTrack: 'action.player.nextTrack',
      previousTrack: 'action.player.previousTrack',
      currentTrack: 'action.player.currentTrack'
    }
  }
}

export default Listeners
