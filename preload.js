const os = require("os");
const path = require("path");
const { ipcRenderer } = require("electron");
const { contextBridge } = require("electron");

contextBridge.exposeInMainWorld("os", {
  homedir: () => os.homedir(),
});

contextBridge.exposeInMainWorld("path", {
  join: (...args) => path.join(...args),
});

contextBridge.exposeInMainWorld("ipcRenderer", {
  send: (channel, data) => ipcRenderer.send(channel, data),
  on: (channel, func) =>
    ipcRenderer.on(channel, (event, ...args) => func(...args)),
});

contextBridge.exposeInMainWorld("dialog", {
  selectFolder: () => ipcRenderer.invoke("dialog:openDirectory"),
});
