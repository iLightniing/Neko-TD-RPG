const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 400,
    minHeight: 500,
    resizable: false, // Empêche le redimensionnement manuel par l'utilisateur
    frame: false, // On retire la barre Windows native
    show: false, // Masquer au démarrage pour éviter le flash
    backgroundColor: '#0f172a', // Fond slate-900 pour éviter le blanc
    webPreferences: {
      // Sécurité maximale :
      nodeIntegration: false, 
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.cjs')
    },
  });

  // URL de Nuxt
  const url = process.env.VITE_DEV_SERVER_URL || 'http://localhost:3000';
  win.loadURL(url);

  win.once('ready-to-show', () => {
    win.show()
  })
}

// Gestion des événements de la barre de titre personnalisée
ipcMain.handle('window-minimize', (event) => {
  const win = BrowserWindow.fromWebContents(event.sender)
  win?.minimize()
})

ipcMain.handle('window-maximize', (event) => {
  const win = BrowserWindow.fromWebContents(event.sender)
  if (win?.isMaximized()) {
    win.unmaximize()
  } else {
    win?.maximize()
  }
})

ipcMain.handle('window-close', (event) => {
  const win = BrowserWindow.fromWebContents(event.sender)
  win?.close()
})

ipcMain.handle('window-resize', (event, width, height) => {
  const win = BrowserWindow.fromWebContents(event.sender)
  if (win) {
    win.setSize(width, height)
  }
})

ipcMain.handle('window-center', (event) => {
  const win = BrowserWindow.fromWebContents(event.sender)
  win?.center()
})

app.whenReady().then(createWindow);