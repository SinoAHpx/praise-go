import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { PomodoroConfig, DEFAULT_POMODORO_CONFIG } from '@renderer/utils/pomodoroUtils'

// Available DaisyUI themes
export const AVAILABLE_THEMES = [
    'light',
    'dark',
    'cupcake',
    'bumblebee',
    'emerald',
    'corporate',
    'synthwave',
    'retro',
    'cyberpunk',
    'valentine',
    'halloween',
    'garden',
    'forest',
    'aqua',
    'lofi',
    'pastel',
    'fantasy',
    'wireframe',
    'black',
    'luxury',
    'dracula',
    'cmyk',
    'autumn',
    'business',
    'acid',
    'lemonade',
    'night',
    'coffee',
    'winter'
] as const

export type Theme = (typeof AVAILABLE_THEMES)[number]

type PomodoroState = {
    secondsRemaining: number
    isRunning: boolean
    isComplete: boolean
    status: 'working' | 'breaking'
    completedSessions: number
    config: PomodoroConfig
    isSidebarExpanded: boolean
    darkMode: boolean
    notificationSound: string
    autoStartBreaks: boolean
    theme: Theme
}

type PomodoroActions = {
    handleToggle: () => void
    handleReset: () => void
    startNextSession: () => void
    handleStop: () => void
    setSecondsRemaining: (seconds: number | ((prevSeconds: number) => number)) => void
    toggleSidebar: () => void
    updateConfig: (newConfig: Partial<PomodoroConfig>) => void
    toggleDarkMode: () => void
    setNotificationSound: (sound: string) => void
    toggleAutoStartBreaks: () => void
    setTheme: (theme: Theme) => void
}

// Load settings from localStorage or use defaults
const loadSettings = () => {
    try {
        const savedSettings = localStorage.getItem('pomodoroSettings')
        if (savedSettings) {
            return JSON.parse(savedSettings)
        }
    } catch (error) {
        console.error('Error loading settings:', error)
    }
    return {}
}

const savedSettings = loadSettings()

const usePomodoroStore = create<PomodoroState & PomodoroActions>()(
    immer((set, get) => ({
        secondsRemaining: DEFAULT_POMODORO_CONFIG.workMinutes * 60,
        isRunning: false,
        isComplete: false,
        status: 'working',
        completedSessions: 0,
        config: {
            ...DEFAULT_POMODORO_CONFIG,
            ...(savedSettings.config || {})
        },
        isSidebarExpanded: false,
        darkMode: savedSettings.darkMode || false,
        notificationSound: savedSettings.notificationSound || 'bell',
        autoStartBreaks:
            savedSettings.autoStartBreaks !== undefined ? savedSettings.autoStartBreaks : true,
        theme: savedSettings.theme || 'light',

        toggleSidebar: () => {
            set((state) => {
                state.isSidebarExpanded = !state.isSidebarExpanded
                if (!state.isSidebarExpanded) {
                    window.screenAPI.setWindowSize(600, 500)
                } else {
                    window.screenAPI.setWindowSize(350, 500)
                }
            })
        },

        handleToggle: () => {
            if (get().isComplete) {
                get().startNextSession()
            } else {
                set((state) => {
                    state.isRunning = !state.isRunning
                })
            }
        },

        handleReset: () => {
            set((state) => {
                state.secondsRemaining = state.config.workMinutes * 60
                state.isRunning = false
                state.isComplete = false
                state.status = 'working'
                state.completedSessions = 0
            })
        },

        startNextSession: () => {
            const { config, autoStartBreaks } = get()
            const { longBreakInterval, longBreakMinutes, shortBreakMinutes, workMinutes } = config

            set((state) => {
                if (state.status === 'working') {
                    state.completedSessions += 1
                    state.status = 'breaking'
                    // Only auto-start if the setting is enabled
                    state.isRunning = autoStartBreaks
                } else {
                    state.status = 'working'
                    state.isRunning = true // Always auto-start work sessions
                }

                const nextTotalSeconds =
                    state.status === 'working'
                        ? workMinutes * 60
                        : (state.completedSessions % longBreakInterval === 0
                              ? longBreakMinutes
                              : shortBreakMinutes) * 60

                state.isComplete = false
                state.secondsRemaining = nextTotalSeconds
            })
        },

        handleStop: () => {
            const { config } = get()
            const { longBreakInterval, longBreakMinutes, shortBreakMinutes, workMinutes } = config

            set((state) => {
                const nextStatus = state.status === 'working' ? 'breaking' : 'working'
                const nextCompletedSessions =
                    state.status === 'working'
                        ? state.completedSessions + 1
                        : state.completedSessions

                const nextTotalSeconds =
                    state.status === 'working'
                        ? (nextCompletedSessions % longBreakInterval === 0
                              ? longBreakMinutes
                              : shortBreakMinutes) * 60
                        : workMinutes * 60

                if (state.status === 'working') {
                    state.completedSessions = nextCompletedSessions
                }
                state.status = nextStatus
                state.secondsRemaining = nextTotalSeconds
                state.isRunning = false
                state.isComplete = false
            })
        },

        setSecondsRemaining: (seconds) => {
            set((state) => {
                if (typeof seconds === 'function') {
                    state.secondsRemaining = seconds(state.secondsRemaining)
                } else {
                    state.secondsRemaining = seconds
                }
            })
        },

        updateConfig: (newConfig) => {
            set((state) => {
                state.config = { ...state.config, ...newConfig }

                // If we're currently in a session, update the remaining time based on the new config
                if (!state.isRunning && !state.isComplete) {
                    if (state.status === 'working') {
                        state.secondsRemaining = state.config.workMinutes * 60
                    } else {
                        state.secondsRemaining =
                            (state.completedSessions % state.config.longBreakInterval === 0
                                ? state.config.longBreakMinutes
                                : state.config.shortBreakMinutes) * 60
                    }
                }

                // Save to localStorage
                try {
                    const settings = {
                        config: state.config,
                        darkMode: state.darkMode,
                        notificationSound: state.notificationSound,
                        autoStartBreaks: state.autoStartBreaks,
                        theme: state.theme
                    }
                    localStorage.setItem('pomodoroSettings', JSON.stringify(settings))
                } catch (error) {
                    console.error('Error saving settings:', error)
                }
            })
        },

        toggleDarkMode: () => {
            set((state) => {
                state.darkMode = !state.darkMode

                // Apply dark mode to document
                if (state.darkMode) {
                    document.documentElement.classList.add('dark')
                } else {
                    document.documentElement.classList.remove('dark')
                }

                // Save to localStorage
                try {
                    const settings = {
                        config: state.config,
                        darkMode: state.darkMode,
                        notificationSound: state.notificationSound,
                        autoStartBreaks: state.autoStartBreaks,
                        theme: state.theme
                    }
                    localStorage.setItem('pomodoroSettings', JSON.stringify(settings))
                } catch (error) {
                    console.error('Error saving settings:', error)
                }
            })
        },

        setNotificationSound: (sound) => {
            set((state) => {
                state.notificationSound = sound

                // Save to localStorage
                try {
                    const settings = {
                        config: state.config,
                        darkMode: state.darkMode,
                        notificationSound: state.notificationSound,
                        autoStartBreaks: state.autoStartBreaks,
                        theme: state.theme
                    }
                    localStorage.setItem('pomodoroSettings', JSON.stringify(settings))
                } catch (error) {
                    console.error('Error saving settings:', error)
                }
            })
        },

        toggleAutoStartBreaks: () => {
            set((state) => {
                state.autoStartBreaks = !state.autoStartBreaks

                // Save to localStorage
                try {
                    const settings = {
                        config: state.config,
                        darkMode: state.darkMode,
                        notificationSound: state.notificationSound,
                        autoStartBreaks: state.autoStartBreaks,
                        theme: state.theme
                    }
                    localStorage.setItem('pomodoroSettings', JSON.stringify(settings))
                } catch (error) {
                    console.error('Error saving settings:', error)
                }
            })
        },

        setTheme: (theme) => {
            set((state) => {
                state.theme = theme

                // Apply theme to document
                document.documentElement.setAttribute('data-theme', theme)

                // If theme is dark-based, also set dark mode
                const darkThemes = [
                    'dark',
                    'synthwave',
                    'halloween',
                    'forest',
                    'black',
                    'luxury',
                    'dracula',
                    'night',
                    'coffee'
                ]
                if (darkThemes.includes(theme)) {
                    state.darkMode = true
                    document.documentElement.classList.add('dark')
                } else {
                    state.darkMode = false
                    document.documentElement.classList.remove('dark')
                }

                // Save to localStorage
                try {
                    const settings = {
                        config: state.config,
                        darkMode: state.darkMode,
                        notificationSound: state.notificationSound,
                        autoStartBreaks: state.autoStartBreaks,
                        theme: state.theme
                    }
                    localStorage.setItem('pomodoroSettings', JSON.stringify(settings))
                } catch (error) {
                    console.error('Error saving settings:', error)
                }
            })
        }
    }))
)

export default usePomodoroStore
