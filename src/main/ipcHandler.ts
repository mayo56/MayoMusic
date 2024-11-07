import { BrowserWindow, dialog, ipcMain, IpcMainEvent } from 'electron'
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
    // --- Verification
    // Vérification du dossier
    const pathname = `${AppSettings().settings.savePath}/MayoMusic`
    if (!fs.existsSync(pathname)) {
      fs.mkdirSync(pathname)
    }

    // Récupération de la liste de dossier
    const folderList = fs
      .readdirSync(pathname, { withFileTypes: true })
      .filter((e) => e.isDirectory())
      .map((e) => e.name)

    // Mise en format des dossiers
    for (const folder of folderList) {
      let cover: undefined | string = undefined
      let order: string[] = []

      const album_pathname = `${pathname}/${folder}`

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
      }
      if (order.length === 0) {
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
        order
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
    // Envoie des données (en cache)
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
    // --- Verifications 1st step ---
    const temp_album = library.filter((e) => e.title === args.album)
    if (!temp_album) {
      event.sender.send('ErrorCreate', {
        status: 1
      })
      return
    }
    // -----
    const album = temp_album[0]
    const musicName = album.order[args.index]

    // --- Verifications 2d step ---
    // Vérification de l'existence de l'album
    if (!fs.existsSync(`${album.path}`)) {
      event.sender.send('ErrorCreate', {
        status: 1
      })
      return
    }
    // Vérification de l'existence du fichier
    else if (!fs.existsSync(`${album.path}/${musicName}`)) {
      event.sender.send('ErrorCreate', {
        status: 1
      })
      return
    }

    // --- Get audio file and send to Web ---
    // Audio file
    const audio = fs.readFileSync(`${album.path}/${musicName}`, 'base64')

    // Set Audio Queue
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

  /**
   * Incrémente ou décrémente une variable
   * @param index
   * @param change
   */
  const indexUpdate = (index: number, change: number): number => {
    index += change
    if (index === queue.order.length) {
      return 0
    } else if (index < 0) {
      return queue.order.length - 1
    }
    return index
  }

  /**
   * Checking the queue of album
   * @param index
   * @param change
   * @param event
   */
  const validityFileVerifications = (
    index: number | null,
    change: number,
    event: IpcMainEvent
  ): { name: string; audio: string; index: number } | null => {
    // --- Verification 1st step ---
    // Queue and index arg
    if (queue.albumName === '' || index === null) return null

    // --- Verification 2nd step ---
    // File validity
    index = indexUpdate(index, change)
    while (!fs.existsSync(`${queue.path}/${queue.order[index]}`)) {
      const temp = index
      index = indexUpdate(index, change)

      // Si l'incrémentation est la même,
      // alors il n'y a plus de fichier valide
      if (temp === index) {
        event.sender.send('ErrorCreate', {
          status: 1
        })
        return null
      }
    }

    // --- If all good ---
    // Get Audio File
    const audio = fs.readFileSync(`${queue.path}/${queue.order[index]}`, 'base64')

    // Send the result
    return {
      name: queue.order[index],
      audio: `data:audio/mp3;base64,${audio}`,
      index
    }
  }

  // Next music
  ipcMain.on('nextMusic', (event, index: number | null) => {
    // --- Verifications ---
    const info = validityFileVerifications(index, 1, event)
    if (!info) return
    // ---------------------

    event.sender.send('playMusic', info)
  })

  // Previous music
  ipcMain.on('previousMusic', (event, index: number | null) => {
    // --- Verification ---
    const info = validityFileVerifications(index, 1, event)
    if (!info) return
    // --------------------

    event.sender.send('playMusic', info)
  })
}

// Partie DL
function ipcDownload(): void {
  // Verification de yt-dlp
  ipcMain.on('yt-dlp-status:req', (event): void => {
    exec('yt-dlp --version', (err, stdout, stderr) => {
      // Valeur yt dlp
      const data = {
        error: false,
        version: '',
        message: ''
      }
      // Formatage des données
      if (err) {
        data.error = true
      } else if (stderr) {
        data.error = true
        data.message = stderr
      } else {
        data.version = stdout
      }
      // Envoie
      return event.sender.send('yt-dlp-status:res', data)
    })
  })

  // Téléchargement des musiques
  ipcMain.on(
    'yt-dlp-download:req',
    (event, args: { url: string; playlist: boolean; quality: string; folderName: string }) => {
      // --- Verification args ---
      if (
        !['best', 'medium', 'low'].includes(args.quality) ||
        args.url === '' ||
        args.folderName === ''
      ) {
        event.sender.send('ErrorCreate', {
          status: 1
        })
        return
      }

      const commande = `yt-dlp "${args.url}" ${args.playlist ? '--yes-playlist' : '--no-playlist'} --audio-quality ${args.quality} -o "${AppSettings().settings.savePath}/MayoMusic/${args.folderName}/%(title)s.%(ext)s"`

      // Command Execution
      exec(commande, (err) => {
        // -- Verification d'erreur --
        if (err) {
          event.sender.send('ErrorCreate', {
            status: 1
          })
          console.log(err)
          return
        }
        // ------
        // Envoie d'une notification pour dire que c'est terminé
        event.sender.send('NotificationCreate:yt-dlp-success-download')
      })
    }
  )
}

export { ipcHandler, ipcLibrary, ipcDownload }
