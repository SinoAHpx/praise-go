import { faPause, faPlay, faRefresh, faStop } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Box from '@renderer/components/Box'
import RadicalProgress from '@renderer/components/RadicalProgress'
import { useEffect, useState } from 'react'

interface PomodoroConfig {
    workMinutes?: number
    shortBreakMinutes?: number
    longBreakMinutes?: number
    longBreakInterval?: number
}

export default function Pomodoro({
    workMinutes = 1,
    shortBreakMinutes = 5,
    longBreakMinutes = 15,
    longBreakInterval = 4
}: PomodoroConfig) {
    const [secondsRemaining, setSecondsRemaining] = useState(workMinutes * 60)
    const [isRunning, setIsRunning] = useState(false)
    const [isComplete, setIsComplete] = useState(false)
    const [status, setStatus] = useState<'working' | 'breaking'>('working')
    const [completedSessions, setCompletedSessions] = useState(0)

    const getCurrentTotalSeconds = () => {
        if (status === 'working') {
            return workMinutes * 60
        }
        // If it's break time and we've completed a number of sessions divisible by longBreakInterval
        if (completedSessions % longBreakInterval === 0) {
            return longBreakMinutes * 60
        }
        return shortBreakMinutes * 60
    }

    const formatTime = (seconds: number): string => {
        const minutes = Math.floor(seconds / 60)
        const remainingSeconds = seconds % 60
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
    }

    const handleToggle = () => {
        if (isComplete) {
            startNextSession()
        } else {
            setIsRunning((prev) => !prev)
        }
    }

    const handleReset = () => {
        setSecondsRemaining(workMinutes * 60)
        setIsRunning(false)
        setIsComplete(false)
        setStatus('working')
        setCompletedSessions(0)
    }

    const startNextSession = () => {
        if (status === 'working') {
            // Work session completed
            setCompletedSessions((prev) => prev + 1)
            setStatus('breaking')
        } else {
            // Break session completed
            setStatus('working')
        }

        const nextTotalSeconds =
            status === 'working'
                ? ((completedSessions + 1) % longBreakInterval === 0
                      ? longBreakMinutes
                      : shortBreakMinutes) * 60
                : workMinutes * 60

        setIsComplete(false)
        setIsRunning(true)
        setSecondsRemaining(nextTotalSeconds)
    }

    useEffect(() => {
        if (isComplete) {
            return
        }

        let interval: NodeJS.Timeout | undefined

        if (isRunning) {
            interval = setInterval(() => {
                setSecondsRemaining((prev) => {
                    if (prev <= 1) {
                        setIsComplete(true)
                        setIsRunning(false)
                        return 0
                    }
                    return prev - 1
                })
            }, 1000)
        }

        return () => {
            if (interval) clearInterval(interval)
        }
    }, [isRunning, isComplete])

    const getStatusMessage = () => {
        if (isComplete) {
            // Show next session message when current session is complete
            return status === 'working' 
                ? (completedSessions + 1) % longBreakInterval === 0
                    ? 'Ready for a Long Break!'
                    : 'Ready for a Short Break!'
                : 'Ready to Focus!'
        }

        // Show current session message
        if (status === 'working') {
            return 'Time to Focus!'
        }
        return completedSessions % longBreakInterval === 0 
            ? 'Time for a Long Break!' 
            : 'Time for a Short Break!'
    }

    const handleStop = () => {
        // Calculate next session details before changing status
        const nextStatus = status === 'working' ? 'breaking' : 'working'
        const nextCompletedSessions = status === 'working' ? completedSessions + 1 : completedSessions
        
        // Calculate next session duration
        const nextTotalSeconds = status === 'working'
            ? ((nextCompletedSessions % longBreakInterval === 0)
                ? longBreakMinutes
                : shortBreakMinutes) * 60
            : workMinutes * 60

        // Update all states at once for smooth transition
        if (status === 'working') {
            setCompletedSessions(nextCompletedSessions)
        }
        setStatus(nextStatus)
        setSecondsRemaining(nextTotalSeconds)
        setIsRunning(false)
        setIsComplete(false)
    }

    return (
        <>
            <Box
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                    flex: 1,
                    width: '100%',
                    padding: '1rem',
                    minHeight: '0'
                }}
            >
                <div className="text-xl sm:text-2xl font-semibold mb-4 capitalize text-center">
                    {getStatusMessage()}
                </div>
                <div className="w-full max-w-[20rem] sm:max-w-[24rem] md:max-w-[28rem] aspect-square relative">
                    <RadicalProgress
                        value={getCurrentTotalSeconds() - secondsRemaining}
                        totalValue={getCurrentTotalSeconds()}
                        onComplete={() => {
                            setIsComplete(true)
                        }}
                        content={
                            <span className="text-3xl sm:text-4xl md:text-5xl font-bold">
                                {formatTime(secondsRemaining)}
                            </span>
                        }
                    />
                </div>
                <div className="flex gap-x-3 mt-4">
                    <button onClick={handleReset} className="btn btn-circle btn-md">
                        <FontAwesomeIcon icon={faRefresh} className="text-lg sm:text-xl" />
                    </button>
                    <button onClick={handleToggle} className="btn btn-circle btn-md">
                        {isRunning && !isComplete ? (
                            <FontAwesomeIcon icon={faPause} className="text-lg sm:text-xl" />
                        ) : (
                            <FontAwesomeIcon icon={faPlay} className="text-lg sm:text-xl" />
                        )}
                    </button>
                    <button 
                        onClick={handleStop} 
                        className="btn btn-circle btn-md"
                        disabled={!isRunning || isComplete}
                    >
                        <FontAwesomeIcon icon={faStop} className="text-lg sm:text-xl" />
                    </button>
                </div>
                <div className="mt-4 text-sm text-gray-500">
                    Session {completedSessions + 1} •{' '}
                    {status === 'working'
                        ? 'Work'
                        : completedSessions % longBreakInterval === 0
                          ? 'Long Break'
                          : 'Short Break'}
                </div>
            </Box>
        </>
    )
}
