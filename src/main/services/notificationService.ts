import { BrowserWindow, Notification } from 'electron'

export class NotificationService {
    static isSupported(): boolean {
        return Notification.isSupported()
    }

    static async sendNotification(title: string, body: string): Promise<void> {
        if (!this.isSupported()) {
            console.warn('Notifications are not supported on this system')
            return
        }

        const notification = new Notification({
            title,
            body,
            silent: false,
            urgency: 'critical',
            timeoutType: 'never',
            actions: [{
                type: 'button',
                text: 'OK'
            }]
        })

        notification.on('click', this.handleNotificationClick)
        notification.show()
    }

    private static handleNotificationClick(): void {
        const windows = BrowserWindow.getAllWindows()
        if (windows.length > 0) {
            const mainWindow = windows[0]
            if (mainWindow.isMinimized()) mainWindow.restore()
            mainWindow.focus()
        }
    }
} 