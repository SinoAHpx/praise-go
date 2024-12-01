// import { writeFileSync } from "fs"

import { useState } from "react"

function App() {
    const [img, setImg] = useState('')

    return (
        <>
            <h1>Hello, World</h1>
            <img src={img} style={{
                height: '500px',
                width: '1000px'
            }}/>
            <button
                onClick={async () => {
                    const url = await window.screenAPI.getScreenShot()
                    setImg(url)
                }}
            >
                Take screen shot
            </button>
        </>
    )
}

export default App
