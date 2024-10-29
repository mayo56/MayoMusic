import { BrowserWindow, dialog, ipcMain } from 'electron'
import fs from 'node:fs'
import { AppSettings } from './libs/store'
import { Music, music_setting } from './Types/types'

function ipcHandler(): void {
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
}

/**
 * @brief Liste des event ipcMain pour la liste des musiques
 * Deux events : `req` & `reload` Musics.
 * Renvoi toujours un event `MusicLibrary` pour remettre à jour
 * les titres
 */
function ipcLibrary(): void {
  let library: Music[] = [
    { title: 'oui', path: '/', cover: null },
    { title: 'oui', path: '/', cover: null },
    { title: 'oui', path: '/', cover: null },
    {
      title: 'oui',
      path: '/',
      cover: null
    }
  ]
  const formatMusicFolder = (): void => {
    const folderList = fs.readdirSync(`${AppSettings().settings.savePath}/MayoMusic`)
    // Mise en format des dossiers
    for (const folder of folderList) {
      let cover: null | string = null
      if (fs.existsSync(`${AppSettings().settings.savePath}/MayoMusic/${folder}/setting.json`)) {
        const music_setting: music_setting = JSON.parse(
          fs.readFileSync(
            `${AppSettings().settings.savePath}/MayoMusic/${folder}/setting.json`,
            'utf-8'
          )
        )
        cover = fs.readFileSync(
          `${AppSettings().settings.savePath}/MayoMusic/${folder}/${music_setting.cover}`,
          'base64'
        )
      }
      library.push({
        title: folder,
        path: `${AppSettings().settings.savePath}/MayoMusic/${folder}`,
        cover: cover
      })
    }
  }
  formatMusicFolder()
  // REQ ALBUMS
  // Request liste des musiques
  ipcMain.on('reqAlbums', (event) => {
    event.sender.send('MusicLibrary', library)
  })
  // reload la liste des musiques
  ipcMain.on('reloadAlbums', (event) => {
    library = []
    formatMusicFolder()
    event.sender.send('AlbumsLibrary', library)
  })

  // REQ MUSICS
  ipcMain.on('reqAlbums', (event, args) => {
    event.sender.send('MusicLibrary', args)
  })
}

export { ipcHandler, ipcLibrary }
