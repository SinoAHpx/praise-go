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
import { playNotificationSound, showNotification } from '@renderer/utils/notificationUtils'

// Custom hook to handle timer logic
const useTimer = (isRunning: boolean, isComplete: boolean) => {
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
}

// Control button component
interface ControlButtonProps {
    onClick: () => void
    icon: typeof faPlay
    disabled?: boolean
    className?: string
}

const ControlButton: React.FC<ControlButtonProps> = ({ onClick, icon, disabled, className }) => (
    <button
        onClick={onClick}
        className={`btn btn-circle btn-md ${className || ''}`}
        disabled={disabled}
    >
        <FontAwesomeIcon icon={icon} className="text-lg sm:text-xl" />
    </button>
)

// Status display component
interface StatusDisplayProps {
    message: string
    sessionInfo: string
}

const StatusDisplay: React.FC<StatusDisplayProps> = ({ message, sessionInfo }) => (
    <>
        <div className="text-xl sm:text-2xl font-semibold mb-4 capitalize text-center">
            {message}
        </div>
        <div className="mt-4 text-sm text-gray-500">{sessionInfo}</div>
    </>
)

interface PomodoroProps extends Partial<PomodoroConfig> {}

export default function Pomodoro(props: PomodoroProps) {
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
        handleStop,
        notificationSound
    } = usePomodoroStore()

    const isSidebarExpanded = usePomodoroStore((state) => state.isSidebarExpanded)
    const toggleSidebar = usePomodoroStore((state) => state.toggleSidebar)

    const getCurrentTotalSeconds = () =>
        getNextSessionDuration(config, { status, completedSessions })

    // Use the custom timer hook
    useTimer(isRunning, isComplete)

    // Handle session completion
    useEffect(() => {
        if (isComplete) {
            // Play notification sound
            playNotificationSound(notificationSound)
            
            // Show notification
            const nextSessionType = status === 'working' ? 'Break' : 'Work'
            showNotification('Pomodoro Timer', `Time's up! ${nextSessionType} session is ready to start.`)
        }
    }, [isComplete, status, notificationSound])

    const statusMessage = getStatusMessage(
        isComplete,
        status,
        completedSessions,
        config.longBreakInterval
    )

    const sessionInfo = `Session ${completedSessions + 1} • ${getSessionType(
        status,
        completedSessions,
        config.longBreakInterval
    )}`
    
    // Function to test notification sound
    const testNotificationSound = () => {
        playNotificationSound(notificationSound);
        showNotification('Test Notification', 'This is a test notification');
    };

    return (
        <div className="flex flex-col items-center justify-between h-full w-full py-6 px-4 overflow-hidden">
            <div className="w-full text-center">
                <StatusDisplay message={statusMessage} sessionInfo={sessionInfo} />
            </div>

            <div className="flex-1 flex items-center justify-center w-full max-w-full">
                <div className="w-full max-w-[20rem] sm:max-w-[24rem] md:max-w-[28rem] aspect-square relative">
                    <RadicalProgress
                        value={getCurrentTotalSeconds() - secondsRemaining}
                        totalValue={getCurrentTotalSeconds()}
                        onComplete={() => {
                            usePomodoroStore.setState({ isComplete: true })
                        }}
                        content={
                            <span className="text-3xl sm:text-4xl md:text-5xl font-bold">
                                {formatTime(secondsRemaining)}
                            </span>
                        }
                    />
                </div>
            </div>

            <div className="w-full flex justify-center mt-4">
                <div className="flex gap-x-3">
                    <ControlButton
                        icon={faRefresh}
                        onClick={() => {
                            handleReset()
                        }}
                    />
                    <ControlButton
                        icon={isRunning && !isComplete ? faPause : faPlay}
                        onClick={() => {
                            handleToggle()
                        }}
                    />
                    <ControlButton
                        icon={faStop}
                        onClick={() => {
                            handleStop()
                        }}
                        disabled={!isRunning || isComplete}
                    />
                </div>
            </div>
            
            {/* Hidden in production, useful for development */}
            {process.env.NODE_ENV === 'development' && (
                <button 
                    className="mt-4 text-xs opacity-50 hover:opacity-100"
                    onClick={testNotificationSound}
                >
                    Test Notification
                </button>
            )}
        </div>
    )
}
