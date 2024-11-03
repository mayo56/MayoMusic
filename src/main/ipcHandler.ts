import { BrowserWindow, dialog, ipcMain } from 'electron'
import fs from 'node:fs'
import { AppSettings } from './libs/store'
import { Music, music_setting } from './Types/types'

import path from 'node:path'

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
  let library: Music[] = []
  // Formatage des dossiers
  const formatMusicFolder = (): void => {
    const folderList = fs
      .readdirSync(`${AppSettings().settings.savePath}/MayoMusic`, { withFileTypes: true })
      .filter((e) => e.isDirectory())
      .map((e) => e.name)
    console.log(folderList)
    // Mise en format des dossiers
    for (const folder of folderList) {
      let cover: undefined | string = undefined
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
        cover: cover ? `data:image/png;base64,${cover}` : undefined
      })
    }
  }
  formatMusicFolder()
  // REQ ALBUMS
  // Request liste des musiques
  ipcMain.on('reqAlbums', (event): void => {
    event.sender.send('AlbumsList', library)
  })
  // reload la liste des musiques
  ipcMain.on('reloadAlbums', (event): void => {
    library = []
    formatMusicFolder()
    event.sender.send('AlbumsList', library)
  })

  // REQ MUSICS
  ipcMain.on('reqMusics', (event, args: string): void => {
    if (args === '' || !args) return
    const listOfMusics = fs
      .readdirSync(`${AppSettings().settings.savePath}/MayoMusic/${args}/`)
      .filter((e) =>
        ['.ogg', '.mp3', '.webm', '.m4a', '.opus'].includes(path.extname(e).toLowerCase())
      )

    // Envoie des données
    event.sender.send('MusicsList', {
      musics: listOfMusics,
      cover: library.filter((e) => e.title === args)[0].cover
    })
  })

  // EVENT PLAYER
  // File d'attente de musique
  // const queue = []
  // Start a music
  ipcMain.on('sendMusic', (event, args: { album: string; music: string }) => {
    const audio = fs.readFileSync(
      `${AppSettings().settings.savePath}/MayoMusic/${args.album}/${args.music}`,
      'base64'
    )
    event.sender.send('playMusic', {
      name: args.music,
      audio: `data:audio/mp3;base64,${audio}`
    })
  })
  // Next music
  ipcMain.on('nextMusic', (event, args) => {
    // A FINIR
    event.sender.send('playMusic', args)
  })
  // Previous music
  ipcMain.on('previousMusic', (event, args) => {
    // A FINIR
    event.sender.send('playMusic', args)
  })
}

export { ipcHandler, ipcLibrary }
