import { contextBridge, ipcRenderer } from "electron/renderer";

contextBridge.exposeInMainWorld('screenAPI', {
    getScreenShot: () => ipcRenderer.invoke('screen:shot')
})

contextBridge.exposeInMainWorld('notificationAPI', {
    sendNotification: (title: string, body: string) => ipcRenderer.invoke('notification:send', { title, body })
})