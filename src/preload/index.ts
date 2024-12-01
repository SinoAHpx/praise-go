import { contextBridge, ipcRenderer } from "electron/renderer";

contextBridge.exposeInMainWorld('screenAPI', {
    getScreenShot: () => ipcRenderer.invoke('screen:shot')
})