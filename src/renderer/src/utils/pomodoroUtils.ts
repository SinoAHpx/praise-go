export const DEFAULT_POMODORO_CONFIG: PomodoroConfig = {
    workMinutes: 25,
    shortBreakMinutes: 5,
    longBreakMinutes: 15,
    longBreakInterval: 4
}

export interface PomodoroConfig {
    workMinutes: number
    shortBreakMinutes: number
    longBreakMinutes: number
    longBreakInterval: number
}

export interface PomodoroStatus {
    status: 'working' | 'breaking'
    completedSessions: number
}

export const getNextSessionDuration = (
    config: PomodoroConfig,
    currentStatus: PomodoroStatus
): number => {
    const { workMinutes, shortBreakMinutes, longBreakMinutes, longBreakInterval } = config
    const { status, completedSessions } = currentStatus

    if (status === 'working') {
        return workMinutes * 60
    }
    
    return (completedSessions % longBreakInterval === 0)
        ? longBreakMinutes * 60
        : shortBreakMinutes * 60
}

export const getStatusMessage = (
    isComplete: boolean,
    status: 'working' | 'breaking',
    completedSessions: number,
    longBreakInterval: number
): string => {
    if (isComplete) {
        return status === 'working' 
            ? (completedSessions + 1) % longBreakInterval === 0
                ? 'Ready for a Long Break!'
                : 'Ready for a Short Break!'
            : 'Ready to Focus!'
    }

    if (status === 'working') {
        return 'Time to Focus!'
    }
    
    return completedSessions % longBreakInterval === 0 
        ? 'Time for a Long Break!' 
        : 'Time for a Short Break!'
}

export const getSessionType = (
    status: 'working' | 'breaking',
    completedSessions: number,
    longBreakInterval: number
): string => {
    if (status === 'working') {
        return 'Work'
    }
    return completedSessions % longBreakInterval === 0 
        ? 'Long Break'
        : 'Short Break'
} 