import { desktopCapturer, screen } from 'electron/main'

export async function getScreenShot() : Promise<string> {
    const sources = await desktopCapturer
    .getSources({
        types: ['screen'],
        thumbnailSize: screen.getPrimaryDisplay().workAreaSize
    })
    
    const buffer = sources[0].thumbnail.toDataURL()

    return buffer
}
