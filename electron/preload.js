const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  saveToken: (token) => ipcRenderer.send("save-token", token),
  loadToken: () => ipcRenderer.invoke("load-token"),
  clearToken: () => ipcRenderer.send("clear-token"),
});