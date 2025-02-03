import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

interface SettingsProps {
  onBack: () => void;
}

const Settings: React.FC<SettingsProps> = ({ onBack }) => {
  return (
    <div className="h-full bg-white dark:bg-gray-800">
      <div className="p-6">
        <button 
          onClick={onBack} 
          className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6 transition-colors duration-200"
        >
          <FontAwesomeIcon icon={faArrowLeft} />
          <span>Back</span>
        </button>
        <h1 className="text-2xl font-bold mb-8">Settings</h1>
        <div className="space-y-6">
          <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Work Duration</h3>
            <input 
              type="range" 
              min="1" 
              max="60" 
              defaultValue="25"
              className="w-full"
            />
            <div className="text-right text-sm text-gray-500">25 minutes</div>
          </div>
          <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Short Break Duration</h3>
            <input 
              type="range" 
              min="1" 
              max="30" 
              defaultValue="5"
              className="w-full"
            />
            <div className="text-right text-sm text-gray-500">5 minutes</div>
          </div>
          <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Long Break Duration</h3>
            <input 
              type="range" 
              min="1" 
              max="60" 
              defaultValue="15"
              className="w-full"
            />
            <div className="text-right text-sm text-gray-500">15 minutes</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings; 