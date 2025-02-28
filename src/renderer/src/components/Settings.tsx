import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faMoon, faSun, faBell, faPlay, faPause, faPalette } from '@fortawesome/free-solid-svg-icons';
import usePomodoroStore, { Theme, AVAILABLE_THEMES } from '@renderer/app/pomodoroStore';
import { playNotificationSound } from '@renderer/utils/notificationUtils';

interface SettingsProps {
  onBack: () => void;
}

// Group themes for better organization
const THEME_GROUPS = {
  'Light Themes': ['light', 'cupcake', 'bumblebee', 'emerald', 'corporate', 'retro', 'valentine', 'garden', 'aqua', 'lofi', 'pastel', 'fantasy', 'wireframe', 'cmyk', 'autumn', 'business', 'acid', 'lemonade', 'winter'],
  'Dark Themes': ['dark', 'synthwave', 'halloween', 'forest', 'black', 'luxury', 'dracula', 'night', 'coffee'],
  'Special Themes': ['cyberpunk']
};

// Define custom theme presets with descriptive names
const THEME_PRESETS = {
  'Productivity': [
    { name: 'Focus Mode', theme: 'dracula' },
    { name: 'Clean Workspace', theme: 'lofi' },
    { name: 'Minimal', theme: 'corporate' }
  ],
  'Creative': [
    { name: 'Inspiration', theme: 'synthwave' },
    { name: 'Artistic', theme: 'fantasy' },
    { name: 'Vibrant', theme: 'cyberpunk' }
  ],
  'Relaxing': [
    { name: 'Calm', theme: 'aqua' },
    { name: 'Soothing', theme: 'garden' },
    { name: 'Cozy', theme: 'coffee' }
  ],
  'Seasonal': [
    { name: 'Spring', theme: 'pastel' },
    { name: 'Summer', theme: 'bumblebee' },
    { name: 'Fall', theme: 'autumn' },
    { name: 'Winter', theme: 'winter' }
  ]
};

// Define theme categories
type ThemeCategory = 'light' | 'dark' | 'custom';

// Define direct light and dark theme lists
const LIGHT_THEMES = ['light', 'cupcake', 'bumblebee', 'emerald', 'corporate', 'retro', 'valentine', 'garden', 'aqua', 'lofi', 'pastel', 'fantasy', 'wireframe', 'cmyk', 'autumn', 'business', 'acid', 'lemonade', 'winter'];
const DARK_THEMES = ['dark', 'synthwave', 'halloween', 'forest', 'black', 'luxury', 'dracula', 'night', 'coffee'];
const SPECIAL_THEMES = ['cyberpunk'];

const Settings: React.FC<SettingsProps> = ({ onBack }) => {
  const config = usePomodoroStore((state) => state.config);
  const darkMode = usePomodoroStore((state) => state.darkMode);
  const notificationSound = usePomodoroStore((state) => state.notificationSound);
  const autoStartBreaks = usePomodoroStore((state) => state.autoStartBreaks);
  const theme = usePomodoroStore((state) => state.theme);
  const updateConfig = usePomodoroStore((state) => state.updateConfig);
  const toggleDarkMode = usePomodoroStore((state) => state.toggleDarkMode);
  const setNotificationSound = usePomodoroStore((state) => state.setNotificationSound);
  const toggleAutoStartBreaks = usePomodoroStore((state) => state.toggleAutoStartBreaks);
  const setTheme = usePomodoroStore((state) => state.setTheme);
  
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [activeThemeCategory, setActiveThemeCategory] = useState<ThemeCategory>(
    theme === 'light' ? 'light' : 
    theme === 'dark' ? 'dark' : 'custom'
  );

  // Debugging useEffect
  useEffect(() => {
    console.log(`[${new Date().toISOString()}] Tab switched to: ${activeThemeCategory}`);
  }, [activeThemeCategory]);

  const handleWorkMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    updateConfig({ workMinutes: value });
  };

  const handleShortBreakMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    updateConfig({ shortBreakMinutes: value });
  };

  const handleLongBreakMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    updateConfig({ longBreakMinutes: value });
  };

  const handleLongBreakIntervalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    updateConfig({ longBreakInterval: value });
  };

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    // Update active category based on the selected theme
    if (newTheme === 'light') {
      setActiveThemeCategory('light');
    } else if (newTheme === 'dark') {
      setActiveThemeCategory('dark');
    } else {
      setActiveThemeCategory('custom');
    }
    // Don't auto-close the theme selector in the inline version
    // setShowThemeModal(false);
  };

  // Function to capitalize first letter of each word
  const formatThemeName = (themeName: string) => {
    return themeName
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="h-full flex flex-col bg-base-100 overflow-hidden">
      {/* Fixed Header */}
      <div className="p-6 pb-2">
        <button 
          onClick={onBack} 
          className="btn btn-ghost btn-sm gap-2 mb-4"
        >
          <FontAwesomeIcon icon={faArrowLeft} />
          <span>Back</span>
        </button>
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>
      
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-6 pb-6">
        <div className="space-y-6">
          {/* Theme Selector */}
          <div className="card bg-base-200 shadow-sm">
            <div className="card-body p-4">
              {!showThemeModal ? (
                <div className="flex justify-between items-center">
                  <h3 className="card-title text-sm">Theme</h3>
                  <button 
                    onClick={() => setShowThemeModal(true)}
                    className="btn btn-sm btn-outline gap-2"
                  >
                    <FontAwesomeIcon icon={faPalette} />
                    <span>{formatThemeName(theme)}</span>
                  </button>
                </div>
              ) : (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="card-title text-sm">Theme</h3>
                    <button 
                      onClick={() => setShowThemeModal(false)}
                      className="btn btn-sm btn-outline"
                    >
                      Close
                    </button>
                  </div>
                  
                  <div className="tabs tabs-boxed mb-4">
                    <a 
                      className={`tab ${activeThemeCategory === 'light' ? 'tab-active' : ''}`} 
                      onClick={() => setActiveThemeCategory('light')}
                    >
                      Light
                    </a>
                    <a 
                      className={`tab ${activeThemeCategory === 'dark' ? 'tab-active' : ''}`} 
                      onClick={() => setActiveThemeCategory('dark')}
                    >
                      Dark
                    </a>
                    <a 
                      className={`tab ${activeThemeCategory === 'custom' ? 'tab-active' : ''}`}
                      onClick={() => setActiveThemeCategory('custom')}
                    >
                      Custom
                    </a>
                  </div>
                  
                  <div className="overflow-y-auto max-h-80 pr-2 custom-scrollbar">
                    {activeThemeCategory === 'light' && (
                      <div className="mb-4">
                        <h4 className="font-semibold mb-2 text-sm opacity-70">Light Themes</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {LIGHT_THEMES.map((themeName) => (
                            <button
                              key={themeName}
                              className={`btn btn-sm ${theme === themeName ? 'btn-primary' : 'btn-outline'}`}
                              onClick={() => handleThemeChange(themeName as Theme)}
                            >
                              {formatThemeName(themeName)}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {activeThemeCategory === 'dark' && (
                      <div className="mb-4">
                        <h4 className="font-semibold mb-2 text-sm opacity-70">Dark Themes</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {DARK_THEMES.map((themeName) => (
                            <button
                              key={themeName}
                              className={`btn btn-sm ${theme === themeName ? 'btn-primary' : 'btn-outline'}`}
                              onClick={() => handleThemeChange(themeName as Theme)}
                            >
                              {formatThemeName(themeName)}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {activeThemeCategory === 'custom' && (
                      <>
                        {/* Theme Presets Section */}
                        <div className="mb-4">
                          <h4 className="font-semibold mb-2 text-sm opacity-70">Theme Presets</h4>
                          <div className="text-xs opacity-70 mb-3">Curated theme combinations</div>
                          
                          {Object.entries(THEME_PRESETS).map(([category, presets]) => (
                            <div key={category} className="mb-4">
                              <h5 className="font-medium text-xs opacity-80 mb-2">{category}</h5>
                              <div className="grid grid-cols-2 gap-2">
                                {presets.map((preset) => (
                                  <button
                                    key={preset.name}
                                    className={`btn btn-sm ${theme === preset.theme ? 'btn-primary' : 'btn-outline'}`}
                                    onClick={() => handleThemeChange(preset.theme as Theme)}
                                  >
                                    {preset.name}
                                  </button>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        {/* All Themes Section */}
                        <div className="mb-4">
                          <div className="divider text-xs opacity-70">All Themes</div>
                          <div className="grid grid-cols-2 gap-2">
                            {AVAILABLE_THEMES.map(themeName => (
                              <button
                                key={themeName}
                                className={`btn btn-sm ${theme === themeName ? 'btn-primary' : 'btn-outline'}`}
                                onClick={() => handleThemeChange(themeName as Theme)}
                              >
                                {formatThemeName(themeName)}
                              </button>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Notification Sound */}
          <div className="card bg-base-200 shadow-sm">
            <div className="card-body p-4">
              <h3 className="card-title text-sm mb-2">Notification Sound</h3>
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faBell} className="text-base-content opacity-70" />
                <select 
                  value={notificationSound}
                  onChange={(e) => setNotificationSound(e.target.value)}
                  className="select select-bordered select-sm w-full"
                >
                  <option value="bell">Bell</option>
                  <option value="chime">Chime</option>
                  <option value="digital">Digital</option>
                  <option value="none">None</option>
                </select>
                <button 
                  className="btn btn-sm btn-ghost"
                  onClick={() => playNotificationSound(notificationSound)}
                  disabled={notificationSound === 'none'}
                  title="Test Sound"
                >
                  <FontAwesomeIcon icon={faPlay} />
                </button>
              </div>
            </div>
          </div>

          {/* Auto Start Breaks */}
          <div className="card bg-base-200 shadow-sm">
            <div className="card-body p-4">
              <div className="flex justify-between items-center">
                <h3 className="card-title text-sm">Auto Start Breaks</h3>
                <input 
                  type="checkbox" 
                  className="toggle toggle-primary" 
                  checked={autoStartBreaks}
                  onChange={toggleAutoStartBreaks}
                />
              </div>
              <div className="text-xs opacity-70 mt-2">
                {autoStartBreaks ? (
                  <div className="flex items-center gap-1">
                    <FontAwesomeIcon icon={faPlay} className="text-success" />
                    <span>Breaks will start automatically</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    <FontAwesomeIcon icon={faPause} className="text-warning" />
                    <span>Breaks need to be started manually</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Work Duration */}
          <div className="card bg-base-200 shadow-sm">
            <div className="card-body p-4">
              <h3 className="card-title text-sm mb-2">Work Duration</h3>
              <input 
                type="range" 
                min="1" 
                max="60" 
                value={config.workMinutes}
                onChange={handleWorkMinutesChange}
                className="range range-primary"
                step="1"
              />
              <div className="w-full flex justify-between text-xs px-2 mt-1">
                <span>1</span>
                <span>15</span>
                <span>30</span>
                <span>45</span>
                <span>60</span>
              </div>
              <div className="text-right text-sm opacity-70 mt-1">{config.workMinutes} minutes</div>
            </div>
          </div>

          {/* Short Break Duration */}
          <div className="card bg-base-200 shadow-sm">
            <div className="card-body p-4">
              <h3 className="card-title text-sm mb-2">Short Break Duration</h3>
              <input 
                type="range" 
                min="1" 
                max="30" 
                value={config.shortBreakMinutes}
                onChange={handleShortBreakMinutesChange}
                className="range range-secondary"
                step="1"
              />
              <div className="w-full flex justify-between text-xs px-2 mt-1">
                <span>1</span>
                <span>8</span>
                <span>15</span>
                <span>22</span>
                <span>30</span>
              </div>
              <div className="text-right text-sm opacity-70 mt-1">{config.shortBreakMinutes} minutes</div>
            </div>
          </div>

          {/* Long Break Duration */}
          <div className="card bg-base-200 shadow-sm">
            <div className="card-body p-4">
              <h3 className="card-title text-sm mb-2">Long Break Duration</h3>
              <input 
                type="range" 
                min="1" 
                max="60" 
                value={config.longBreakMinutes}
                onChange={handleLongBreakMinutesChange}
                className="range range-accent"
                step="1"
              />
              <div className="w-full flex justify-between text-xs px-2 mt-1">
                <span>1</span>
                <span>15</span>
                <span>30</span>
                <span>45</span>
                <span>60</span>
              </div>
              <div className="text-right text-sm opacity-70 mt-1">{config.longBreakMinutes} minutes</div>
            </div>
          </div>

          {/* Long Break Interval */}
          <div className="card bg-base-200 shadow-sm">
            <div className="card-body p-4">
              <h3 className="card-title text-sm mb-2">Long Break Interval</h3>
              <input 
                type="range" 
                min="2" 
                max="8" 
                value={config.longBreakInterval}
                onChange={handleLongBreakIntervalChange}
                className="range range-info"
                step="1"
              />
              <div className="w-full flex justify-between text-xs px-2 mt-1">
                <span>2</span>
                <span>3</span>
                <span>4</span>
                <span>6</span>
                <span>8</span>
              </div>
              <div className="text-right text-sm opacity-70 mt-1">Every {config.longBreakInterval} sessions</div>
            </div>
          </div>

          {/* Feedback message */}
          <div className="text-center text-sm text-success opacity-80">
            <div className="flex items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Settings update automatically</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings; 