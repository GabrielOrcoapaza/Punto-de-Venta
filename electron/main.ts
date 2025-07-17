import { app, BrowserWindow } from 'electron';
import path from 'path';
import * as url from 'url';

const isDev = !app.isPackaged;  // true cuando usas `npm run dev`

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  if (isDev) {
    // Carga la app de Vite en desarrollo
    win.loadURL('http://localhost:5173');
    // Permite F12
    win.webContents.on('before-input-event', (event, input) => {
      if (input.type === 'keyDown' && input.key === 'F12') {
        win.webContents.toggleDevTools();
      }
    });
  } else {
    // Carga archivo local generado por Vite en producción
    win.loadURL(
      url.format({
        pathname: path.join(__dirname, 'dist', 'index.html'),
        protocol: 'file:',
        slashes: true,
      })
    );
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});