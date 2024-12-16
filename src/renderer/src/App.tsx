import { useEffect, useState } from 'react'
import usePomodoroStore from './app/pomodoroStore'
import Pomodoro from './features/Pomodoro'
import { praise } from './services/llm'

function App() {
    const [txt, setTxt] = useState('')

    const handleClick = async () => {
        const response = await praise()
        setTxt(response)
    }

    return (
        <>
            <p>{txt}</p>
            <button className='btn' onClick={handleClick}>Click me to query</button>
        </>
    )
}

export default App
