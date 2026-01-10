"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
electron_1.contextBridge.exposeInMainWorld('electronAPI', {
    saveToken: (token) => electron_1.ipcRenderer.invoke('save-token', token),
    loadToken: () => electron_1.ipcRenderer.invoke('load-token'),
    clearToken: () => electron_1.ipcRenderer.invoke('clear-token'),
    saveRefreshToken: (token) => electron_1.ipcRenderer.invoke('save-refresh-token', token),
    loadRefreshToken: () => electron_1.ipcRenderer.invoke('load-refresh-token'),
    clearRefreshToken: () => electron_1.ipcRenderer.invoke('clear-refresh-token'),
});
