import React, { useEffect } from 'react'
import usePomodoroStore from '../app/pomodoroStore'
import Pomodoro from '../features/Pomodoro'
import { praise } from '../services/llm'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCog } from '@fortawesome/free-solid-svg-icons'

interface HomeProps {
    onShowSettings: () => void
}

const Home: React.FC<HomeProps> = ({ onShowSettings }) => {
    const isRunning = usePomodoroStore((state) => state.isRunning)
    // const isSidebarExpanded = usePomodoroStore((state) => state.isSidebarExpanded)
    
    useEffect(() => {
        if (!isRunning) return
        const intervalId = setInterval(() => {
            ;(async () => {
                try {
                    const screenshotDataUrl = await window.screenAPI.getScreenShot()
                    console.log('Screenshot URL starts with:', screenshotDataUrl.substring(0, 100))
                    const response = await praise(screenshotDataUrl)
                    console.log('API Response:', response)
                    if (Notification.permission === 'granted') {
                        new Notification('Praise', { body: response })
                    } else {
                        Notification.requestPermission().then((permission) => {
                            if (permission === 'granted') {
                                new Notification('Praise', { body: response })
                            }
                        })
                    }
                } catch (error) {
                    console.error('Error:', error)
                }
            })()
        }, 20000)
        return () => clearInterval(intervalId)
    }, [isRunning])

    return (
        <div className="flex h-full">
            <div className={`flex-1 ${!isRunning ? 'mr-64' : ''}`}>
                <Pomodoro />
            </div>

            {/* Side Panel */}
            <div
                className={`fixed right-0 top-0 h-full bg-white dark:bg-gray-800 shadow-lg overflow-y-auto ${isRunning ? 'w-0 opacity-0' : 'w-64 opacity-100'}`}
            >
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">Statistics</h2>
                        <button
                            onClick={onShowSettings}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <FontAwesomeIcon icon={faCog} />
                        </button>
                    </div>
                    <div className="space-y-4">
                        <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                Today's Focus Time
                            </h3>
                            <p className="text-2xl font-bold">2h 30m</p>
                        </div>
                        <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                Completed Sessions
                            </h3>
                            <p className="text-2xl font-bold">
                                {usePomodoroStore((state) => state.completedSessions)}
                            </p>
                        </div>
                        <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                Current Status
                            </h3>
                            <p className="text-2xl font-bold capitalize">
                                {usePomodoroStore((state) => state.status)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home
