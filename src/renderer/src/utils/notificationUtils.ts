// Map of sound names to their file paths
const SOUND_PATHS = {
    bell: './sounds/bell.mp3',
    chime: './sounds/chime.mp3',
    digital: './sounds/digital.mp3',
    none: ''
}

// Cache for audio objects
const audioCache: Record<string, HTMLAudioElement> = {}

/**
 * Play a notification sound
 * @param soundName The name of the sound to play
 */
export const playNotificationSound = (soundName: string): void => {
    // If sound is set to none, don't play anything
    if (soundName === 'none') return

    // Get the sound path
    const soundPath = SOUND_PATHS[soundName as keyof typeof SOUND_PATHS] || SOUND_PATHS.bell

    // If no sound path, don't play anything
    if (!soundPath) return

    try {
        // Create or get cached audio element
        if (!audioCache[soundName]) {
            audioCache[soundName] = new Audio(soundPath)
        }

        // Reset and play
        const audio = audioCache[soundName]
        audio.currentTime = 0
        audio.play().catch((error) => {
            console.error('Error playing notification sound:', error)
        })
    } catch (error) {
        console.error('Error setting up notification sound:', error)
    }
}

/**
 * Show a browser notification
 * @param title The notification title
 * @param body The notification body
 */
export const showNotification = (title: string, body: string): void => {
    // Check if notifications are supported
    if (!('Notification' in window)) {
        console.warn('This browser does not support desktop notifications')
        return
    }

    // Check if permission is already granted
    if (Notification.permission === 'granted') {
        new Notification(title, { body })
    }
    // Otherwise, request permission
    else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then((permission) => {
            if (permission === 'granted') {
                new Notification(title, { body })
            }
        })
    }
}

/**
 * Preload notification sounds to avoid delays when playing them
 */
export const preloadNotificationSounds = (): void => {
    Object.entries(SOUND_PATHS).forEach(([soundName, soundPath]) => {
        // Skip 'none' sound
        if (soundName === 'none' || !soundPath) return

        try {
            // Create and cache audio element
            if (!audioCache[soundName]) {
                const audio = new Audio(soundPath)
                audio.load() // Start loading the audio file
                audioCache[soundName] = audio
            }
        } catch (error) {
            console.error(`Error preloading sound ${soundName}:`, error)
        }
    })
}
