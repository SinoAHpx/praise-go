import { ipcMain } from 'electron'
import { NotificationService } from '../services/notificationService'
import { getScreenShot } from '../helpers/screenshot-helper'

export function setupIpcHandlers(): void {
    ipcMain.handle('screen:shot', () => {
        return getScreenShot()
    })

    ipcMain.handle('notification:send', async (_, { title, body }) => {
        await NotificationService.sendNotification(title, body)
    })
} 