import { app } from 'electron'
import { settings } from '../Types/types'
import fs from 'node:fs'

/**
 * @brief Récupère les settings de l'application
 */
export function AppSettings(): settings {
  let sett: settings = {
    settings: {
      savePath: app.getPath('music')
    }
  }
  fs.readFile(
    `${app.getPath('userData')}/MayoMusicSettings/settings.json`,
    'utf-8',
    (err, data) => {
      if (err) {
        console.error(err)
        fs.mkdirSync(`${app.getPath('userData')}/MayoMusicSettings`)
        fs.writeFileSync(
          `${app.getPath('userData')}/MayoMusicSettings/settings.json`,
          JSON.stringify(sett)
        )
      }
      console.table(data)
      sett = JSON.parse(data) as settings
    }
  )
  return sett
}
