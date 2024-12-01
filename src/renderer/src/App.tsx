// import { writeFileSync } from "fs"

import { useState } from "react"
import Button from "tdesign-react/es/button/Button"

function App() {
    const [img, setImg] = useState('')

    return (
        <>
            <h1>Hello, World</h1>
            <img src={img} style={{
                height: '500px',
                width: '1000px'
            }}/>
            <Button
                onClick={async () => {
                    const url = await window.screenAPI.getScreenShot()
                    setImg(url)
                }}
            >
                Take screen shot
            </Button>
        </>
    )
}

export default App
