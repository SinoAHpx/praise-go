import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    screenAPI: {
        getScreenShot: () => Promise<string>
    }
    api: unknown
  }
}
