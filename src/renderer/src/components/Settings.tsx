import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faMoon, faSun, faBell, faPlay, faPause, faPalette } from '@fortawesome/free-solid-svg-icons';
import usePomodoroStore, { AVAILABLE_THEMES, Theme } from '@renderer/app/pomodoroStore';
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
  
  const [workMinutes, setWorkMinutes] = useState(config.workMinutes);
  const [shortBreakMinutes, setShortBreakMinutes] = useState(config.shortBreakMinutes);
  const [longBreakMinutes, setLongBreakMinutes] = useState(config.longBreakMinutes);
  const [longBreakInterval, setLongBreakInterval] = useState(config.longBreakInterval);
  const [hasChanges, setHasChanges] = useState(false);
  const [showThemeModal, setShowThemeModal] = useState(false);

  useEffect(() => {
    // Reset local state when config changes from outside
    setWorkMinutes(config.workMinutes);
    setShortBreakMinutes(config.shortBreakMinutes);
    setLongBreakMinutes(config.longBreakMinutes);
    setLongBreakInterval(config.longBreakInterval);
  }, [config]);

  // Check if there are unsaved changes
  useEffect(() => {
    const configChanged = 
      workMinutes !== config.workMinutes ||
      shortBreakMinutes !== config.shortBreakMinutes ||
      longBreakMinutes !== config.longBreakMinutes ||
      longBreakInterval !== config.longBreakInterval;
    
    setHasChanges(configChanged);
  }, [workMinutes, shortBreakMinutes, longBreakMinutes, longBreakInterval, config]);

  const handleWorkMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setWorkMinutes(value);
  };

  const handleShortBreakMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setShortBreakMinutes(value);
  };

  const handleLongBreakMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setLongBreakMinutes(value);
  };

  const handleLongBreakIntervalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setLongBreakInterval(value);
  };

  const saveSettings = () => {
    updateConfig({
      workMinutes,
      shortBreakMinutes,
      longBreakMinutes,
      longBreakInterval
    });
    setHasChanges(false);
  };

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    setShowThemeModal(false);
  };

  // Function to capitalize first letter of each word
  const formatThemeName = (themeName: string) => {
    return themeName
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Theme Modal Portal Component
  const ThemeModalPortal = () => {
    return createPortal(
      <div className="fixed inset-0 flex items-center justify-center z-[9999]">
        <div className="fixed inset-0 bg-black bg-opacity-70" onClick={() => setShowThemeModal(false)}></div>
        <div className="modal-box relative z-10 max-w-md w-full max-h-[80vh] flex flex-col bg-base-100 shadow-xl border border-base-300">
          <button 
            className="btn btn-sm btn-circle absolute right-2 top-2 z-10" 
            onClick={() => setShowThemeModal(false)}
          >
            ✕
          </button>
          
          <div className="p-4 pb-0">
            <h3 className="font-bold text-lg mb-4">Select Theme</h3>
            
            <div className="tabs tabs-boxed mb-4">
              <a className={`tab ${theme === 'light' ? 'tab-active' : ''}`} onClick={() => handleThemeChange('light')}>Light</a>
              <a className={`tab ${theme === 'dark' ? 'tab-active' : ''}`} onClick={() => handleThemeChange('dark')}>Dark</a>
              <a className={`tab ${!['light', 'dark'].includes(theme) ? 'tab-active' : ''}`}>Custom</a>
            </div>
            
            {/* Theme Preview */}
            <div className="mb-4 p-3 border border-base-300 rounded-lg">
              <div className="text-sm font-semibold mb-2 opacity-70">Preview</div>
              <div className="flex gap-2 mb-2">
                <button className="btn btn-primary btn-sm">Primary</button>
                <button className="btn btn-secondary btn-sm">Secondary</button>
                <button className="btn btn-accent btn-sm">Accent</button>
              </div>
              <div className="flex gap-2">
                <button className="btn btn-info btn-sm">Info</button>
                <button className="btn btn-success btn-sm">Success</button>
                <button className="btn btn-warning btn-sm">Warning</button>
                <button className="btn btn-error btn-sm">Error</button>
              </div>
            </div>
          </div>
          
          <div className="overflow-y-auto flex-1 px-4 pr-2 custom-scrollbar">
            {Object.entries(THEME_GROUPS).map(([groupName, themes]) => (
              <div key={groupName} className="mb-4">
                <h4 className="font-semibold mb-2 text-sm opacity-70">{groupName}</h4>
                <div className="grid grid-cols-2 gap-2">
                  {themes.map((themeName) => (
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
            ))}
          </div>
          
          <div className="p-4 pt-2">
            <button className="btn btn-primary w-full" onClick={() => setShowThemeModal(false)}>Close</button>
          </div>
        </div>
      </div>,
      document.body
    );
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
            </div>
          </div>

          {/* Dark Mode Toggle */}
          <div className="card bg-base-200 shadow-sm">
            <div className="card-body p-4">
              <div className="flex justify-between items-center">
                <h3 className="card-title text-sm">Dark Mode</h3>
                <label className="swap swap-rotate">
                  <input type="checkbox" checked={darkMode} onChange={toggleDarkMode} />
                  <FontAwesomeIcon icon={faSun} className="swap-on w-5 h-5" />
                  <FontAwesomeIcon icon={faMoon} className="swap-off w-5 h-5" />
                </label>
              </div>
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
                value={workMinutes}
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
              <div className="text-right text-sm opacity-70 mt-1">{workMinutes} minutes</div>
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
                value={shortBreakMinutes}
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
              <div className="text-right text-sm opacity-70 mt-1">{shortBreakMinutes} minutes</div>
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
                value={longBreakMinutes}
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
              <div className="text-right text-sm opacity-70 mt-1">{longBreakMinutes} minutes</div>
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
                value={longBreakInterval}
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
              <div className="text-right text-sm opacity-70 mt-1">Every {longBreakInterval} sessions</div>
            </div>
          </div>

          {/* Save Button */}
          <button 
            onClick={saveSettings}
            disabled={!hasChanges}
            className={`btn btn-block ${hasChanges ? 'btn-primary' : 'btn-disabled'} mb-4`}
          >
            {hasChanges ? 'Save Settings' : 'No Changes'}
          </button>
        </div>
      </div>

      {/* Render the theme modal using portal */}
      {showThemeModal && <ThemeModalPortal />}
    </div>
  );
};

export default Settings; 