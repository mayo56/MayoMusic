import { app } from 'electron'
import { settings } from '../Types/types'
import fs from 'node:fs'

/**
 * @brief Récupère les settings de l'application
 */
export function AppSettings(): settings {
  let sett: settings = {
    settings: {
      savePath: `${app.getPath('music')}/MayoMusic`
    }
  }

  const pathname = `${app.getPath('userData')}/MayoMusicSettings/`

  if (!fs.existsSync(pathname)) {
    fs.mkdirSync(pathname)
  }
  if (!fs.existsSync(`${pathname}/settings.json`)) {
    fs.writeFileSync(`${pathname}/settings.json`, JSON.stringify(sett))
  } else {
    fs.readFile(`${pathname}/settings.json`, 'utf-8', (err, data) => {
      if (err) {
        console.error(err)
        fs.mkdirSync(`${app.getPath('userData')}/MayoMusicSettings`)
        fs.writeFileSync(
          `${app.getPath('userData')}/MayoMusicSettings/settings.json`,
          JSON.stringify(sett)
        )
      }
      sett = JSON.parse(data) as settings
    })
  }

  return sett
}

export const AppGlobalSetting = `${app.getPath('userData')}/MayoMusicSettings/settings.json`
