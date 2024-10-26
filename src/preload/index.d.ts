import { ElectronAPI } from '@electron-toolkit/preload'
import { Music } from "./index";

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      library: {
        req(): void,
        MusicLibrary(callback: (musics: Music[]) => void)
        reloadList(): void
      }
      openFolderDialog(): Promise<string>
    }
  }
}
