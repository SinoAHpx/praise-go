import './assets/main.css'
import React, { useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import usePomodoroStore from './app/pomodoroStore'

// Initialize theme and dark mode from localStorage before rendering
const initializeTheme = () => {
  try {
    const savedSettings = localStorage.getItem('pomodoroSettings')
    if (savedSettings) {
      const { darkMode, theme } = JSON.parse(savedSettings)
      
      // Apply theme
      if (theme) {
        document.documentElement.setAttribute('data-theme', theme)
      }
      
      // Apply dark mode
      if (darkMode) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }
  } catch (error) {
    console.error('Error initializing theme:', error)
  }
}

// Call initialization function
initializeTheme()

// Wrapper component to initialize store
const AppWrapper = () => {
  const darkMode = usePomodoroStore((state) => state.darkMode)
  const theme = usePomodoroStore((state) => state.theme)
  
  useEffect(() => {
    // This ensures dark mode is applied when the store is initialized
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])
  
  useEffect(() => {
    // This ensures theme is applied when the store is initialized
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])
  
  return <App />
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <AppWrapper />
  </React.StrictMode>
)