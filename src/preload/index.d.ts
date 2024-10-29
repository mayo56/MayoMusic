import { ElectronAPI } from '@electron-toolkit/preload'
import { Album, Music } from "./index";

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      library: {
        // REQ ALBUMS
        reqAlbums(): void,
        AlbumsLibrary(callback: (albums: Album[]) => void)
        reloadAlbums(): void
        // REQ MUSICS
        reqMusics(albumName: string): void
        MusicsLibrary(callback: (musics: Music[]) => void)
      }
      openFolderDialog(): Promise<string>
    }
  }
}
