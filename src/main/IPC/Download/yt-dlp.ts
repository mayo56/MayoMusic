// Dépendances ----
import { AppSettings } from '../../libs/store'
import ErrorCreate from '../../libs/Error'
import { exec } from 'node:child_process'
import { ipcMain } from 'electron'
import fs from 'node:fs'
// ----------------

// ------------------------------------------------------------------------------- //
//                                  DOWNLOAD                                       //
// ------------------------------------------------------------------------------- //

/**
 * @dev
 * Handler ipc pour les téléchargements yt-dlp
 */
const download_yt_dlp = (): void => {
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

export default download_yt_dlp
