import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import fs from "fs";

const isDev = !app.isPackaged;

let mainWindow: BrowserWindow | null = null;
const TOKEN_PATH = path.join(app.getPath("userData"), "token.txt");

ipcMain.on("save-token", (_event, token) => {
  fs.writeFileSync(TOKEN_PATH, token, "utf8");
});

ipcMain.handle("load-token", () => {
  if (fs.existsSync(TOKEN_PATH)) {
    return fs.readFileSync(TOKEN_PATH, "utf8");
  }
  return null;
});

ipcMain.on("clear-token", () => {
  if (fs.existsSync(TOKEN_PATH)) fs.unlinkSync(TOKEN_PATH);
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
    const indexPath = path.join(__dirname, 'dist/index.html');
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