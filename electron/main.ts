import { app, BrowserWindow } from 'electron'

app.whenReady().then(() => {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    backgroundColor: '#000000', // Optionnel : évite le flash blanc au chargement
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  })

  // On utilise l'URL passée par notre script ou localhost par défaut
  const url = process.env.VITE_DEV_SERVER_URL || 'http://localhost:3000'
  win.loadURL(url)
  
  // Ouvre les outils de dév automatiquement pour le debug
  win.webContents.openDevTools()
})