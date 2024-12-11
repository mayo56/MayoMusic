// --- Dépendances IPC ---
import data from './IPC/Data'
import player from './IPC/Player'
import download_yt_dlp from './IPC/Download/yt-dlp'
import LibraryManager from './libs/Library'
// -----------------------

// ----- GLOBAL VARIABLE -----
const library = LibraryManager.getInstance()

// ---------------------------

function ipcHandler(): void {
  library
    .initializeLibrary()
    .then(() => console.log('[INFO] - Library chargée !'))
    .catch((err) => console.error('[ERROR] - Library non chargée...\nError:\n', err))
  data()
  player()
  download_yt_dlp()

  // -- A DEV --
  /*
  ipcMain.handle('dialog:openFolder', async () => {
    const mainWindow = BrowserWindow.getFocusedWindow()
    if (mainWindow) {
      const result = await dialog.showOpenDialog(mainWindow, {
        properties: ['openDirectory']
      })
      return result.filePaths
    }
    return null
  })

  ipcMain.on('action.album.open', (_, albumName: string) => {
    const pathname = `${library_pathname}/${albumName}`
    console.log(pathname)
    exec(`open "${pathname}"`)
  })

  ipcMain.handle('data.album.path', async (): Promise<string> => {
    return AppSettings().settings.savePath
  })


  ipcMain.handle('data.album.modify', (_, pathname: string) => {
    const settings_path = AppGlobalSetting
    const setting: settings = JSON.parse(fs.readFileSync(settings_path, 'utf-8'))
    setting.settings.savePath = pathname
    fs.writeFileSync(settings_path, JSON.stringify(setting))

    library_pathname = pathname
    formatMusicFolder()
    return true
  })
  */
}

export default ipcHandler
