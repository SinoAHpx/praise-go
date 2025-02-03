import { useEffect } from 'react'
import usePomodoroStore from './app/pomodoroStore'
import Pomodoro from './features/Pomodoro'
import { praise } from './services/llm'

function App() {
    const isRunning = usePomodoroStore(state => state.isRunning)

    // Updated useEffect: only runs when pomodoro is running
    useEffect(() => {
        if (!isRunning) return;
        const intervalId = setInterval(() => {
            (async () => {
                try {
                    const screenshotDataUrl = await window.screenAPI.getScreenShot();
                    console.log('Screenshot URL starts with:', screenshotDataUrl.substring(0, 100));

                    const response = await praise(screenshotDataUrl);
                    console.log('API Response:', response);

                    if (Notification.permission === 'granted') {
                        new Notification('Praise', { body: response });
                    } else {
                        Notification.requestPermission().then(permission => {
                            if (permission === 'granted') {
                                new Notification('Praise', { body: response });
                            }
                        });
                    }
                } catch (error) {
                    console.error('Error:', error);
                    // setTxt('Error occurred while processing the request');
                }
            })();
        }, 20000);
        return () => clearInterval(intervalId);
    }, [isRunning]);

    return (
        <>
            <Pomodoro />
        </>
    )
}

export default App
