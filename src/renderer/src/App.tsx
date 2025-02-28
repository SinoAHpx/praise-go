import { useState, useEffect } from 'react'
import Home from '@renderer/components/Home'
import Settings from '@renderer/components/Settings'
import usePomodoroStore from '@renderer/app/pomodoroStore'
import { preloadNotificationSounds } from '@renderer/utils/notificationUtils'

function App() {
    const [showSettings, setShowSettings] = useState(false)
    const theme = usePomodoroStore((state) => state.theme)
    const darkMode = usePomodoroStore((state) => state.darkMode)
    
    // Apply theme and dark mode on app start and when they change
    useEffect(() => {
        // Apply theme
        document.documentElement.setAttribute('data-theme', theme)
        
        // Apply dark mode
        if (darkMode) {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
    }, [theme, darkMode])
    
    // Preload notification sounds
    useEffect(() => {
        preloadNotificationSounds();
    }, []);

    return (
        <div className="flex flex-col h-full w-full overflow-hidden bg-base-100">
            <div className="flex-1 relative overflow-hidden">
                {/* Home Screen */}
                <div
                    className={`absolute inset-0 transition-transform duration-300 ease-in-out ${
                        showSettings ? '-translate-x-full' : 'translate-x-0'
                    }`}
                >
                    <Home onShowSettings={() => setShowSettings(true)} />
                </div>
                
                {/* Settings Screen */}
                <div
                    className={`absolute inset-0 transition-transform duration-300 ease-in-out ${
                        showSettings ? 'translate-x-0' : 'translate-x-full'
                    }`}
                    style={{ 
                        display: showSettings ? 'block' : 'none',
                        height: '100%'
                    }}
                >
                    <Settings onBack={() => setShowSettings(false)} />
                </div>
            </div>
        </div>
    )
}

export default App
