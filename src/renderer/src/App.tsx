import { useEffect } from 'react'
import usePomodoroStore from './app/pomodoroStore'
import Pomodoro from './features/Pomodoro'

function App() {
    const { isRunning } = usePomodoroStore()

    useEffect(() => {
        const i = setInterval(() => {
            if (isRunning) {
                window.notificationAPI.sendNotification('hi', 'this is a notification')
            }
        }, 10000);

        return () => clearInterval(i)
    }, [isRunning])

    return (
        <>
            <Pomodoro/>
        </>
    )
}

export default App
