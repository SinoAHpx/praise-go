import { faPause, faPlay, faRefresh } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Box from '@renderer/components/Box'
import RadicalProgress from '@renderer/components/RadicalProgress'
import { useEffect, useState } from 'react'

export default function Pomodoro({ minutes = 25 }) {
    const totalSeconds = minutes * 60

    const [secondsRemaining, setSecondsRemaining] = useState(totalSeconds)
    const [isRunning, setIsRunning] = useState(false)
    const [isComplete, setIsComplete] = useState(false)
    const [status, setStatus] = useState<'working' | 'breaking'>('working')

    const formatTime = (seconds: number): string => {
        const minutes = Math.floor(seconds / 60)
        const remainingSeconds = seconds % 60
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
    }

    const handleToggle = () => {
        setIsRunning((prev) => !prev)
    }

    const handleReset = () => {
        setSecondsRemaining(totalSeconds)
        setIsRunning(false)
        setIsComplete(false)
        setStatus('working')
    }

    useEffect(() => {
        if (isComplete) {
            return
        }

        let interval

        if (isRunning) {
            interval = setInterval(() => {
                setSecondsRemaining(prev => {
                    if (prev - 1 <= 0) {
                        setIsComplete(true)
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
                    {status === 'working' ? 'Time to Focus!' : 'Time for a Break!'}
                </div>
                <div className="w-full max-w-[20rem] sm:max-w-[24rem] md:max-w-[28rem] aspect-square relative">
                    <RadicalProgress
                        value={totalSeconds - secondsRemaining}
                        totalValue={totalSeconds}
                        onComplete={() => {
                            setIsComplete(true)
                        }}
                        content={<span className="text-3xl sm:text-4xl md:text-5xl font-bold">{formatTime(secondsRemaining)}</span>}
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
                </div>
            </Box>
        </>
    )
}
