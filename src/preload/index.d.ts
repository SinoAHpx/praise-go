import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    screenAPI: {
        getScreenShot: () => Promise<string>
        setWindowSize: (width: number, height: number) => void
    }
    notificationAPI: {
        sendNotification: (title: string, body: string) => Promise<void>
    }
    api: unknown
  }
}
