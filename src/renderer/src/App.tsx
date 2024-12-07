import { useEffect, useState } from 'react'

import Pomodoro from './features/Pomodoro'
import Box from './components/Box'

function App() {
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        const interval = setInterval(async () => {
            setProgress(p => p + 1)
        }, 100)

        return () => clearInterval(interval)
    }, [])

    return (
        <>
            <Box style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flex: 1
            }}>
                <Pomodoro progress={progress} />
            </Box>
        </>
    )
}

export default App
