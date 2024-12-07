import { faPause, faPlay, faRefresh } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Box from '@renderer/components/Box'
import RadicalProgress from '@renderer/components/RadicalProgress'
import { useEffect, useState } from 'react'

export default function Pomodoro() {
    const [progress, setProgress] = useState(0)
    const [isRunning, setIsRunning] = useState(false)

    const handleToggle = () => {
        setIsRunning(prev => !prev)
    }

    const handleReset = () => {
        setProgress(0)
        setIsRunning(false)
    }

    useEffect(() => {
        let interval

        if (isRunning) {
            interval = setInterval(async () => {
                setProgress((p) => p + 1)
            }, 100)
        }

        return () => {
            if (interval) clearInterval(interval)
        }
    }, [isRunning])

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
                <RadicalProgress progress={progress} onComplete={() => {
                    setIsRunning(false)
                }}/>
                <div className="flex gap-x-2.5">
                    <button onClick={handleReset} className="btn btn-circle">
                        <FontAwesomeIcon icon={faRefresh} />
                    </button>
                    <button onClick={handleToggle} className="btn btn-circle">
                        {isRunning ? <FontAwesomeIcon icon={faPause} /> : <FontAwesomeIcon icon={faPlay} />}
                    </button>
                </div>
            </Box>
        </>
    )
}
