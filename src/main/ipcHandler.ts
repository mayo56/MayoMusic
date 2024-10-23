import { ipcMain, BrowserWindow, dialog } from 'electron'

function ipcHandler(): void {
  ipcMain.handle('dialog:openFolder', async () => {
    const mainWindow = BrowserWindow.getFocusedWindow()
    if (mainWindow) {
      const result = await dialog.showOpenDialog(mainWindow, {
        properties: ['openDirectory'],
      })
      return result.filePaths
    }
    return null
  })
}

export default ipcHandler
