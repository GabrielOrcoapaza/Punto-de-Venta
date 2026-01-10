"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const isDev = !electron_1.app.isPackaged;
let mainWindow = null;
const userDataPath = electron_1.app.getPath('userData');
const accessTokenPath = path_1.default.join(userDataPath, 'access.token');
const refreshTokenPath = path_1.default.join(userDataPath, 'refresh.token');
electron_1.ipcMain.handle('save-token', (_, token) => {
    fs_1.default.writeFileSync(accessTokenPath, token);
});
electron_1.ipcMain.handle('load-token', () => {
    try {
        return fs_1.default.readFileSync(accessTokenPath, 'utf-8');
    }
    catch {
        return null;
    }
});
electron_1.ipcMain.handle('clear-token', () => {
    if (fs_1.default.existsSync(accessTokenPath)) {
        fs_1.default.unlinkSync(accessTokenPath);
    }
});
// 🔁 REFRESH
electron_1.ipcMain.handle('save-refresh-token', (_, token) => {
    fs_1.default.writeFileSync(refreshTokenPath, token);
});
electron_1.ipcMain.handle('load-refresh-token', () => {
    try {
        return fs_1.default.readFileSync(refreshTokenPath, 'utf-8');
    }
    catch {
        return null;
    }
});
electron_1.ipcMain.handle('clear-refresh-token', () => {
    if (fs_1.default.existsSync(refreshTokenPath)) {
        fs_1.default.unlinkSync(refreshTokenPath);
    }
});
function createWindow() {
    mainWindow = new electron_1.BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            preload: path_1.default.join(__dirname, "preload.js"),
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
    }
    else {
        const indexPath = path_1.default.join(electron_1.app.getAppPath(), 'dist', 'index.html');
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
electron_1.app.whenReady().then(createWindow);
electron_1.app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
electron_1.app.on('activate', () => {
    if (electron_1.BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
