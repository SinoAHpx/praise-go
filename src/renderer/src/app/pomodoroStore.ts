import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { PomodoroConfig, DEFAULT_POMODORO_CONFIG } from '@renderer/utils/pomodoroUtils'

type PomodoroState = {
    secondsRemaining: number
    isRunning: boolean
    isComplete: boolean
    status: 'working' | 'breaking'
    completedSessions: number
    config: PomodoroConfig
    isSidebarExpanded: boolean
}

type PomodoroActions = {
    handleToggle: () => void
    handleReset: () => void
    startNextSession: () => void
    handleStop: () => void
    setSecondsRemaining: (seconds: number | ((prevSeconds: number) => number)) => void
    toggleSidebar: () => void
}

const usePomodoroStore = create<PomodoroState & PomodoroActions>()(
    immer((set, get) => ({
        secondsRemaining: DEFAULT_POMODORO_CONFIG.workMinutes * 60,
        isRunning: false,
        isComplete: false,
        status: 'working',
        completedSessions: 0,
        config: DEFAULT_POMODORO_CONFIG,
        isSidebarExpanded: false,

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
            const { config } = get()
            const { longBreakInterval, longBreakMinutes, shortBreakMinutes, workMinutes } = config

            set((state) => {
                if (state.status === 'working') {
                    state.completedSessions += 1
                    state.status = 'breaking'
                } else {
                    state.status = 'working'
                }

                const nextTotalSeconds =
                    state.status === 'working'
                        ? (state.completedSessions % longBreakInterval === 0
                              ? longBreakMinutes
                              : shortBreakMinutes) * 60
                        : workMinutes * 60

                state.isComplete = false
                state.isRunning = true
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
        }
    }))
)

export default usePomodoroStore
