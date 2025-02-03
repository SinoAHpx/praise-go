import { faPause, faPlay, faRefresh, faStop } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import RadicalProgress from '@renderer/components/RadicalProgress'
import { formatTime } from '@renderer/utils/time'
import { useEffect } from 'react'
import {
    PomodoroConfig,
    getNextSessionDuration,
    getStatusMessage,
    getSessionType,
    DEFAULT_POMODORO_CONFIG
} from '@renderer/utils/pomodoroUtils'
import usePomodoroStore from '@renderer/app/pomodoroStore'

export default function Pomodoro(props: Partial<PomodoroConfig>) {
    const config: PomodoroConfig = {
        ...DEFAULT_POMODORO_CONFIG,
        ...props
    }

    const {
        secondsRemaining,
        isRunning,
        isComplete,
        status,
        completedSessions,
        handleToggle,
        handleReset,
        handleStop
    } = usePomodoroStore()

    const isSidebarExpanded = usePomodoroStore((state) => state.isSidebarExpanded)
    const toggleSidebar = usePomodoroStore((state) => state.toggleSidebar)
    const getCurrentTotalSeconds = () =>
        getNextSessionDuration(config, { status, completedSessions })

    useEffect(() => {
        if (isComplete) {
            return
        }

        let interval: NodeJS.Timeout | undefined

        if (isRunning) {
            interval = setInterval(() => {
                usePomodoroStore.setState((state) => {
                    if (state.secondsRemaining <= 1) {
                        return { isComplete: true, isRunning: false, secondsRemaining: 0 }
                    }
                    return { secondsRemaining: state.secondsRemaining - 1 }
                })
            }, 1000)
        }

        return () => {
            if (interval) clearInterval(interval)
        }
    }, [isRunning, isComplete])

    return (
        <>
            <div className="select-none flex flex-col items-center justify-center flex-1 w-full p-4 h-full">
                <div className="text-xl sm:text-2xl font-semibold mb-4 capitalize text-center">
                    {getStatusMessage(
                        isComplete,
                        status,
                        completedSessions,
                        config.longBreakInterval
                    )}
                </div>
                <div className="w-full max-w-[20rem] sm:max-w-[24rem] md:max-w-[28rem] aspect-square relative">
                    <RadicalProgress
                        value={getCurrentTotalSeconds() - secondsRemaining}
                        totalValue={getCurrentTotalSeconds()}
                        onComplete={() => {
                            usePomodoroStore.setState({ isComplete: true })
                            toggleSidebar()
                        }}
                        content={
                            <span className="text-3xl sm:text-4xl md:text-5xl font-bold">
                                {formatTime(secondsRemaining)}
                            </span>
                        }
                    />
                </div>
                <div className="flex gap-x-3 mt-4">
                    <button
                        onClick={() => {
                            handleReset()
                            if (isSidebarExpanded) {
                                toggleSidebar()
                            }
                        }}
                        className="btn btn-circle btn-md"
                    >
                        <FontAwesomeIcon icon={faRefresh} className="text-lg sm:text-xl" />
                    </button>
                    <button
                        onClick={() => {
                            handleToggle()
                            toggleSidebar()
                        }}
                        className="btn btn-circle btn-md"
                    >
                        {isRunning && !isComplete ? (
                            <FontAwesomeIcon icon={faPause} className="text-lg sm:text-xl" />
                        ) : (
                            <FontAwesomeIcon icon={faPlay} className="text-lg sm:text-xl" />
                        )}
                    </button>
                    <button
                        onClick={() => {
                            handleStop()
                            toggleSidebar()
                        }}
                        className="btn btn-circle btn-md"
                        disabled={!isRunning || isComplete}
                    >
                        <FontAwesomeIcon icon={faStop} className="text-lg sm:text-xl" />
                    </button>
                </div>
                <div className="mt-4 text-sm text-gray-500">
                    Session {completedSessions + 1} •{' '}
                    {getSessionType(status, completedSessions, config.longBreakInterval)}
                </div>
            </div>
        </>
    )
}
