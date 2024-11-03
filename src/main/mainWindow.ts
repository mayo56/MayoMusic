import icon from '../../resources/icon.png?asset'
import { BrowserWindow, shell } from 'electron'
import { join } from 'path'
import { is } from '@electron-toolkit/utils'

let mainWindow: BrowserWindow | null = null

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    // Titre personnalisé de la fenêtre
    titleBarStyle: 'hiddenInset',
    titleBarOverlay: true,
    transparent: false,
    minWidth: 700,
    minHeight: 500,
    // -----
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      contextIsolation: true
    }
  })
  mainWindow.on('ready-to-show', () => {
    mainWindow!.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  // — EVENT PLEIN ÉCRAN —
  // Entrée en mode pleine écran
  mainWindow.on('enter-full-screen', () => {
    mainWindow?.webContents.send('fullscreen-status', true)
  })
  // Sortie du mode pleine écran
  mainWindow.on('leave-full-screen', () => {
    mainWindow?.webContents.send('fullscreen-status', false)
  })
}

export { mainWindow, createWindow }
