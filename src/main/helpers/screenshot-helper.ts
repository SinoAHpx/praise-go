import { desktopCapturer, screen } from 'electron/main'

export async function getScreenShot() : Promise<Buffer> {
    const sources = await desktopCapturer
    .getSources({
        types: ['screen'],
        thumbnailSize: screen.getPrimaryDisplay().workAreaSize
    })
    
    const buffer = sources[0].thumbnail.toPNG()

    return buffer
}
