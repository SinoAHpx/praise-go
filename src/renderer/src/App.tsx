import React, { useState } from 'react'
import Home from './components/Home'
import Settings from './components/Settings'

function App() {
    const [showSettings, setShowSettings] = useState(false)

    return (
        <>
            {showSettings ? (
                <Settings onBack={() => setShowSettings(false)} />
            ) : (
                <Home onShowSettings={() => setShowSettings(true)} />
            )}
        </>
    )
}

export default App
