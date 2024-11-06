import { BrowserWindow, dialog, ipcMain } from 'electron'
import fs from 'node:fs'
import { exec } from 'node:child_process'
import { AppSettings } from './libs/store'
import path from 'node:path'

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
  let library: Music[] = []
  // Formatage des dossiers
  const formatMusicFolder = (): void => {
    // Liste de album
    const folderList = fs
      .readdirSync(`${AppSettings().settings.savePath}/MayoMusic`, { withFileTypes: true })
      .filter((e) => e.isDirectory())
      .map((e) => e.name)

    // Mise en format des dossiers
    for (const folder of folderList) {
      let cover: undefined | string = undefined
      let order: undefined | string[] = []

      const album_pathname = `${AppSettings().settings.savePath}/MayoMusic/${folder}`

      // Si fichier de configuration
      if (fs.existsSync(`${album_pathname}/setting.json`)) {
        const music_setting: music_setting = JSON.parse(
          fs.readFileSync(`${album_pathname}/setting.json`, 'utf-8')
        )
        if (music_setting.cover) {
          cover = fs.readFileSync(`${album_pathname}/${music_setting.cover}`, 'base64')
        }
        if (music_setting.order) {
          order = music_setting.order
        }
      } else {
        order = fs
          .readdirSync(`${album_pathname}/`)
          .filter((e) =>
            ['.ogg', '.mp3', '.webm', '.m4a', '.opus'].includes(path.extname(e).toLowerCase())
          )
      }

      // On push toute les info dans la library
      library.push({
        title: folder,
        path: `${album_pathname}`,
        cover: cover ? `data:image/png;base64,${cover}` : undefined,
        order: order
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
    // VERIFICATION
    //
    //
    // Envoie des données
    event.sender.send('MusicsList', {
      musics: library.filter((e) => e.title === args)[0].order,
      cover: library.filter((e) => e.title === args)[0].cover
    })
  })

  // EVENT PLAYER
  // File d'attente de musique
  const queue: { albumName: string; order: string[]; path: string } = {
    albumName: '',
    order: [],
    path: ''
  }
  // Start a music
  ipcMain.on('sendMusic', (event, args: { album: string; index: number }) => {
    const album = library.filter((e) => e.title === args.album)[0]
    const musicName = album.order[args.index]

    // Audio file
    const audio = fs.readFileSync(`${album.path}/${musicName}`, 'base64')

    // Audio queue
    queue.order = album.order
    queue.albumName = album.title
    queue.path = album.path

    // Response
    event.sender.send('playMusic', {
      name: musicName,
      audio: `data:audio/mp3;base64,${audio}`,
      index: args.index
    })
  })

  // Next music
  ipcMain.on('nextMusic', (event, args: number | null) => {
    // Si aucune file d'attente
    if (queue.albumName === '' || args === null) return

    let nextMusic = args + 1
    if (nextMusic === queue.order.length) {
      nextMusic = 0
    }

    // Get audio file
    const audio = fs.readFileSync(`${queue.path}/${queue.order[nextMusic]}`, 'base64')

    event.sender.send('playMusic', {
      name: queue.order[nextMusic],
      audio: `data:audio/mp3;base64,${audio}`,
      index: nextMusic
    })
  })
  // Previous music
  ipcMain.on('previousMusic', (event, args: number | null) => {
    // Si aucune file d'attente
    if (queue.albumName === '' || args === null) return

    let nextMusic = args - 1
    if (nextMusic < 0) {
      nextMusic = queue.order.length - 1
    }

    // Get audio file
    const audio = fs.readFileSync(`${queue.path}/${queue.order[nextMusic]}`, 'base64')

    event.sender.send('playMusic', {
      name: queue.order[nextMusic],
      audio: `data:audio/mp3;base64,${audio}`,
      index: nextMusic
    })
  })
}

// Partie DL
function ipcDownload(): void {
  // Verification de yt-dlp
  ipcMain.on('yt-dlp-status:req', (event): void => {
    exec('yt-dlp --version', (err, stdout, stderr) => {
      if (err) {
        return event.sender.send('yt-dlp-status:res', {
          error: true,
          version: '',
          message: ''
        })
      } else if (stderr) {
        return event.sender.send('yt-dlp-status:res', {
          error: true,
          version: '',
          message: stderr
        })
      } else {
        return event.sender.send('yt-dlp-status:res', {
          error: false,
          version: stdout,
          message: ''
        })
      }
    })
  })

  // Téléchargement des musiques
  ipcMain.on('yt-dlp-download:req', (event, args) => {
    let commande = `yt-dlp "${args.url}" `
    args.playlist ? (commande += '--yes-playlist ') : (commande += '--no-playlist ') // playlist
    commande += `--audio-quality ${args.quality} `
    commande += `-o "${AppSettings().settings.savePath}/MayoMusic/${args.folderName}/%(title)s.%(ext)s" `
    exec(commande, (err, stdout, stderr) => {
      if (err) return
      console.log(stdout, stderr)
      event.sender.send('yt-dlp-download:finish')
    })
  })
}

export { ipcHandler, ipcLibrary, ipcDownload }
