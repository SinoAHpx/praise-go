import { contextBridge, ipcRenderer } from 'electron/renderer'

contextBridge.exposeInMainWorld('screenAPI', {
    getScreenShot: () => ipcRenderer.invoke('screen:shot'),
    setWindowSize: (width, height) =>
        ipcRenderer.invoke('screen:setWindowSize', { width, height })
})

contextBridge.exposeInMainWorld('notificationAPI', {
    sendNotification: (title: string, body: string) =>
        ipcRenderer.invoke('notification:send', { title, body })
})