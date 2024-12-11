// Import NodeJS Library
import { BrowserWindow, dialog, ipcMain, IpcMainEvent } from 'electron'
import { AppGlobalSetting, AppSettings } from './libs/store'
import { exec } from 'node:child_process'
import path from 'node:path'
import fs from 'node:fs'

// Custom types and Class
import ErrorCreate from './libs/Error'
import { Music, music_setting, settings } from './Types/types'

// -- GLOBAL VARIABLES AND FUNCTIONS --
const library: Music[] = []
let library_pathname: string = `${AppSettings().settings.savePath}`
// Formatage des dossiers
const formatMusicFolder = (): void => {
  // --- Verification
  // Vérification du dossier
  const pathname = `${AppSettings().settings.savePath}`
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
    let author: null | string = null
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
      if (music_setting.author && music_setting.author.length > 0) {
        author = music_setting.author.join(', ')
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
      author: author,
      cover: cover ? `data:image/png;base64,${cover}` : undefined,
      order
    })
    console.log(library)
  }
}

// -- --

/**
 * @brief Liste des event ipcMain pour la liste des musiques
 * Deux events : `req` & `reload` Musics.
 * Renvoi toujours un event `MusicLibrary` pour remettre à jour
 * les titres
 */
function ipcLibrary(): void {
  formatMusicFolder()

  // ------------------------------------------------------------------------------- //
  //                              ALBUM/MUSICS DATA                                  //
  // ------------------------------------------------------------------------------- //

  /**
   * @dev
   * Requête pour demander la liste des albums présente dans le dossier musiques.
   * Renvoi un 'response.albumsList' avec la liste des albums.
   */
  ipcMain.on('request.albums', (event): void => {
    const albums_list = library.map((e) => {
      return {
        title: e.title,
        path: e.path,
        author: e.author
      }
    })
    event.sender.send('response.albumsList', albums_list)
  })

  /**
   * @dev
   * Requête pour demander la liste des musiques d'un album.
   * Renvoi un 'response.musicsList' avec la liste des musiques de l'album.
   */
  ipcMain.on('request.musics', (event, args: string): void => {
    // Envoie des données (en cache)
    event.sender.send('response.musicsList', {
      musics: library.filter((e) => e.title === args)[0].order,
      cover: library.filter((e) => e.title === args)[0].cover
    })
  })

  // ------------------------------------------------------------------------------- //
  //                                EVENT PLAYER                                     //
  // ------------------------------------------------------------------------------- //
  // ------------
  // File d'attente de musique
  const queue: { albumName: string; order: string[]; path: string } = {
    albumName: '',
    order: [],
    path: ''
  }
  // ------------

  /**
   * @dev
   * Permet de lire une musique sur le player.
   * Lance la musique et charge la liste des autres musiques en file d'attente.
   */
  ipcMain.on('action.player.play', (event, args: { album: string; index: number }) => {
    // --- Verifications 1st step ---
    const temp_album = library.filter((e) => e.title === args.album)
    console.log(temp_album)
    if (!temp_album) {
      console.error('[ERROR] - Album Inconnu')
      return new ErrorCreate(event).setStatus(1).setMessage('').sendError()
    }
    // -----
    const album = temp_album[0]
    const musicName = album.order[args.index]

    // --- Verifications 2d step ---
    // Vérification de l'existence de l'album
    if (!fs.existsSync(`${album.path}`)) {
      console.error('[ERROR] - Dossier Album Inexistant')
      return new ErrorCreate(event).setStatus(1).setMessage('').sendError()
    }
    // Vérification de l'existence du fichier
    else if (!fs.existsSync(`${album.path}/${musicName}`)) {
      console.log(album.path, musicName, fs.existsSync(`${album.path}/${musicName}`))
      console.error('[ERROR] - Music Inconnu')
      return new ErrorCreate(event).setStatus(1).setMessage('').sendError()
    }

    // --- Get audio file and send to Web ---
    // Audio file
    const audio = fs.readFileSync(`${album.path}/${musicName}`, 'base64')

    // Set Audio Queue
    queue.order = album.order
    queue.albumName = album.title
    queue.path = album.path

    // Response
    event.sender.send('action.player.currentTrack', {
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
        new ErrorCreate(event).setStatus(1).setMessage('').sendError()
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

  /**
   * @dev
   * 'action.player.nextTrack'
   * @description Lance la musique suivante
   */
  ipcMain.on('action.player.nextTrack', (event, index: number | null) => {
    // --- Verifications ---
    const info = validityFileVerifications(index, 1, event)
    if (!info) return
    // ---------------------

    event.sender.send('action.player.currentTrack', info)
  })

  /**
   * @dev
   * 'action.player.previousTrack`
   * @description Lance la musique précédente
   */
  ipcMain.on('action.player.previousTrack', (event, index: number | null) => {
    // --- Verification ---
    const info = validityFileVerifications(index, 1, event)
    if (!info) return
    // --------------------

    event.sender.send('action.player.currentTrack', info)
  })
}

// ------------------------------------------------------------------------------- //
//                                  DOWNLOAD                                       //
// ------------------------------------------------------------------------------- //
function ipcDownload(): void {
  // Verification de yt-dlp
  ipcMain.on('status.request.yt-dlp', (event): void => {
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
        data.message = `${err}`
      } else if (stderr) {
        data.error = true
        data.message = stderr
      } else {
        data.version = stdout
      }
      // Envoie
      return event.sender.send('status.response.yt-dlp', data)
    })
  })

  // Téléchargement des musiques
  ipcMain.on(
    'request.download.yt-dlp',
    async (
      event,
      args: { url: string; file_extension: string; quality: string; folderName: string }
    ) => {
      // --- Verification args ---
      if (
        !['best', 'medium', 'low'].includes(args.quality) ||
        args.url === '' ||
        args.folderName === ''
      ) {
        return new ErrorCreate(event).setStatus(1).setMessage('').sendError()
      }
      args.file_extension = 'm4a'

      const info_command = `yt-dlp "${args.url}" --get-title --get-id --skip-download`
      console.log('Loading...')
      // ----- Récupération d'info -----
      exec(info_command, (err, stdout) => {
        // -- Album info --
        const video_list: { title: string; id: string }[] = []
        const pathname = `${AppSettings().settings.savePath}/${args.folderName}`

        // -- existence du dossier --
        const existFolder = fs.existsSync(pathname)
        if (!existFolder) {
          fs.mkdirSync(pathname)
        }

        // -- Errors --
        if (err) {
          console.log(err)
          return new ErrorCreate(event).setStatus(1).setMessage('').sendError()
        }

        // -- Formatage des videos --
        const brut_data: string[] = stdout.trim().split('\n')
        const videos_title: string[] = []
        for (let i = 0; i < brut_data.length; i += 2) {
          // video_title
          videos_title.push(`${brut_data[i]}.${args.file_extension}`)
          // video_list
          video_list.push({
            title: brut_data[i],
            id: brut_data[i + 1]
          })
        }
        console.log(videos_title)

        // --- Téléchargement dans l'ordre ---
        for (const video of video_list) {
          const url = `https://youtu.be`
          const video_command = `yt-dlp "${url}/${video.id}" --extract-audio --audio-format ${args.file_extension} --audio-quality ${args.quality} -o "${pathname}/%(title)s.%(ext)s"`
          exec(video_command, (err) => {
            // -- Error --
            if (err) {
              console.log(err)
              return new ErrorCreate(event).setStatus(1).setMessage('').sendError()
            }

            // Création d'une notification de fin de téléchargement
            event.sender.send('NotificationCreate')
          })
        }

        // -- Formatage de l'album (setting.json) --
        if (existFolder && fs.existsSync(`${pathname}/setting.json`)) {
          const data: { cover: null | string; order: string[] } = JSON.parse(
            fs.readFileSync(`${pathname}/setting.json`, 'utf-8')
          )

          videos_title.map((e) => data.order.push(e))
          fs.writeFileSync(`${pathname}/setting.json`, JSON.stringify(data))
        } else {
          fs.writeFileSync(
            `${pathname}/setting.json`,
            JSON.stringify({ cover: null, order: videos_title })
          )
        }
      })
    }
  )
}

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

  /**
   * @dev
   * Ouvre le répertoire de stockage des albums
   */
  ipcMain.on('action.album.open', (_, albumName: string) => {
    const pathname = `${library_pathname}/${albumName}`
    console.log(pathname)
    exec(`open "${pathname}"`)
  })

  /**
   * @dev
   * Récupère le chemin d'accès au répertoire des albums.
   */
  ipcMain.handle('data.album.path', async (): Promise<string> => {
    return AppSettings().settings.savePath
  })

  /**
   * @dev
   * Modifie le répertoire de stockage d'album.
   */
  ipcMain.handle('data.album.modify', (_, pathname: string) => {
    const settings_path = AppGlobalSetting
    const setting: settings = JSON.parse(fs.readFileSync(settings_path, 'utf-8'))
    setting.settings.savePath = pathname
    fs.writeFileSync(settings_path, JSON.stringify(setting))

    library_pathname = pathname
    formatMusicFolder()
    return true
  })
}

export { ipcHandler, ipcLibrary, ipcDownload }
