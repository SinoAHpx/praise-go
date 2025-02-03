import React, { useState } from 'react'
import Home from './components/Home'
import Settings from './components/Settings'

function App() {
    const [showSettings, setShowSettings] = useState(false)

    return (
        <div className="relative w-full h-full overflow-hidden">
            <div
                className={`absolute w-full h-full overflow-hidden transition-transform duration-300 ease-in-out ${showSettings ? '-translate-x-full' : 'translate-x-0'}`}
            >
                <Home onShowSettings={() => setShowSettings(true)} />
            </div>
            <div className="w-full h-full overflow-y-auto">
                <div
                    className={`w-full h-auto transition-transform duration-300 ease-in-out ${showSettings ? 'translate-x-0' : 'translate-x-full'}`}
                    hidden={!showSettings}
                >
                    <Settings onBack={() => setShowSettings(false)} />
                </div>
            </div>
        </div>
    )
}

export default App
