import Pomodoro from './features/Pomodoro'

function App() {
    return (
        <>
            <button
                className="btn"
                onClick={async () => {
                    // Example usage in a component:
                    await window.notificationAPI.sendNotification(
                        'Title',
                        'This is the notification message'
                    )

                    console.log('hi')
                }}
            >
                Show Notification
            </button>
        </>
    )
}

export default App
