import { ElectronAPI } from '@electron-toolkit/preload'
import { Album } from './index'

declare global {
  interface Window {
    electron: ElectronAPI;
    api: {
      library: {
        // REQ ALBUMS
        reqAlbums(): void,
        AlbumsList(callback: (albums: Album[]) => void)
        reloadAlbums(): void
        // REQ MUSICS
        reqMusics(albumName: string): void
        MusicsList(callback: (musics: { musics: string[]; cover: string | undefined }) => void)
      },
      player: {
        // EVENT PLAY MUSIC
        playMusic(album: string, index: number): void
        receiveMusic(callback: (info: { name: string, audio: string, index: number }) => void)

        // Controller
        nextMusic(index: number | null ): void
        previousMusic(index: number | null): void
      },
      Global: {
        fullscreen(callback: (fullscreen_status: boolean) => void)
      },
      download: {
        yt_dlp_status_req(): void
        yt_dlp_status_res(callback: (data: {
          error: boolean
          message: string
          version: string
        }) => void);
        yt_dlp_download_req(data: {
          url: string
          quality: string
          playlist: boolean
          folderName: string
        }): void
      },
      openFolderDialog(): Promise<string>
    };
  }
}
