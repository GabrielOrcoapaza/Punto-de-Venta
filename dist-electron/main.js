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
const TOKEN_PATH = path_1.default.join(electron_1.app.getPath("userData"), "token.txt");
electron_1.ipcMain.on("save-token", (_event, token) => {
    fs_1.default.writeFileSync(TOKEN_PATH, token, "utf8");
});
electron_1.ipcMain.handle("load-token", () => {
    if (fs_1.default.existsSync(TOKEN_PATH)) {
        return fs_1.default.readFileSync(TOKEN_PATH, "utf8");
    }
    return null;
});
electron_1.ipcMain.on("clear-token", () => {
    if (fs_1.default.existsSync(TOKEN_PATH))
        fs_1.default.unlinkSync(TOKEN_PATH);
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
        const indexPath = path_1.default.join(__dirname, 'dist/index.html');
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
