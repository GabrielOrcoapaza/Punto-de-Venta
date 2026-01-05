import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  saveToken: (token: string) => ipcRenderer.invoke('save-token', token),
  loadToken: () => ipcRenderer.invoke('load-token'),
  clearToken: () => ipcRenderer.invoke('clear-token'),

  saveRefreshToken: (token: string) =>
    ipcRenderer.invoke('save-refresh-token', token),
  loadRefreshToken: () =>
    ipcRenderer.invoke('load-refresh-token'),
  clearRefreshToken: () =>
    ipcRenderer.invoke('clear-refresh-token'),
});