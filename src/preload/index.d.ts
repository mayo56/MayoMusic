import { ElectronAPI } from '@electron-toolkit/preload'
import LibraryAPI from './type/library-api'
import PlayerAPI from './type/player-api'

declare global {
  interface Window {
    electron: ElectronAPI;
    api: {
      library: LibraryAPI
      player: PlayerAPI
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
