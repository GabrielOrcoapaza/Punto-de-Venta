import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import fs from "fs";

const isDev = !app.isPackaged;

let mainWindow: BrowserWindow | null = null;

const userDataPath = app.getPath('userData');
const accessTokenPath = path.join(userDataPath, 'access.token');
const refreshTokenPath = path.join(userDataPath, 'refresh.token');

ipcMain.handle('save-token', (_, token: string) => {
  fs.writeFileSync(accessTokenPath, token);
});

ipcMain.handle('load-token', () => {
  try {
    return fs.readFileSync(accessTokenPath, 'utf-8');
  } catch {
    return null;
  }
});

ipcMain.handle('clear-token', () => {
  if (fs.existsSync(accessTokenPath)) {
    fs.unlinkSync(accessTokenPath);
  }
});

// 🔁 REFRESH
ipcMain.handle('save-refresh-token', (_, token: string) => {
  fs.writeFileSync(refreshTokenPath, token);
});

ipcMain.handle('load-refresh-token', () => {
  try {
    return fs.readFileSync(refreshTokenPath, 'utf-8');
  } catch {
    return null;
  }
});

ipcMain.handle('clear-refresh-token', () => {
  if (fs.existsSync(refreshTokenPath)) {
    fs.unlinkSync(refreshTokenPath);
  }
});

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      webSecurity: false,
      allowRunningInsecureContent: true,
      sandbox: false, // 🔴 IMPORTANTE

    },
  });

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.on('before-input-event', (event, input) => {
      if (input.type === 'keyDown' && input.key === 'F12') {
        mainWindow?.webContents.toggleDevTools();
      }
    });
  } else {
    const indexPath = path.join(app.getAppPath(), 'dist', 'index.html');
    mainWindow.loadFile(indexPath);
  }

  mainWindow.on('ready-to-show', () => {
    mainWindow?.show();
    mainWindow?.focus();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});