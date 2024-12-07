import { faPause, faPlay, faRefresh } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Box from '@renderer/components/Box'
import RadicalProgress from '@renderer/components/RadicalProgress'
import { useEffect, useState } from 'react'

export default function Pomodoro({ minutes = 25 }) {
    const totalSeconds = minutes * 60

    const [value, setValue] = useState(0)
    const [isRunning, setIsRunning] = useState(false)
    const [isComplete, setIsComplete] = useState(false)

    const handleToggle = () => {
        setIsRunning((prev) => !prev)
    }

    const handleReset = () => {
        setValue(0)
        setIsRunning(false)
        setIsComplete(false)
    }

    useEffect(() => {
        if (isComplete) {
            return
        }

        let interval

        if (isRunning) {
            interval = setInterval(async () => {
                setValue(prev => prev + 1)
            }, 10)
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
                    flex: 1
                }}
            >
                <RadicalProgress
                    value={value}
                    totalValue={totalSeconds}
                    onComplete={() => {
                        setIsComplete(true)
                    }}
                    content={<span className="text-4xl font-bold">{value}</span>}
                />
                <div className="flex gap-x-2.5">
                    <button onClick={handleReset} className="btn btn-circle">
                        <FontAwesomeIcon icon={faRefresh} />
                    </button>
                    <button onClick={handleToggle} className="btn btn-circle">
                        {isRunning && !isComplete ? (
                            <FontAwesomeIcon icon={faPause} />
                        ) : (
                            <FontAwesomeIcon icon={faPlay} />
                        )}
                    </button>
                </div>
            </Box>
        </>
    )
}
