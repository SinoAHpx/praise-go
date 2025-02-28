/**
 * Initialize the application with saved settings
 */
export const initializeApp = (): void => {
    try {
        // Load settings from localStorage
        const savedSettings = localStorage.getItem('pomodoroSettings')
        if (savedSettings) {
            const settings = JSON.parse(savedSettings)

            // Apply theme
            if (settings.theme) {
                document.documentElement.setAttribute('data-theme', settings.theme)
            }

            // Apply dark mode
            if (settings.darkMode) {
                document.documentElement.classList.add('dark')
            } else {
                document.documentElement.classList.remove('dark')
            }
        }
    } catch (error) {
        console.error('Error initializing app:', error)
    }
}
