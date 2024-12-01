import { useEffect, useState } from 'react'
import { Typography, Space } from 'tdesign-react';
const { Title, Text, Paragraph } = Typography;

function App() {
    const [img, setImg] = useState('')

    useEffect(() => {
        const interval = setInterval(async () => {
            setImg(await window.screenAPI.getScreenShot())
        }, 1000*60);

        return () => clearInterval(interval)
    }, [])
    
    return (
        <>
            <Title
                style={{
                    margin: 0
                }}
            >
                Praise Go
            </Title>

            {img && <img src={img} style={{
                height: '200px'
            }}/>}

            <Text>awd</Text>
        </>
    )
}

export default App
