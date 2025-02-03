import React from 'react';

interface SettingsProps {
  onBack: () => void;
}

const Settings: React.FC<SettingsProps> = ({ onBack }) => {
  return (
    <div className="p-6">
      <button onClick={onBack} className="mb-4 text-blue-500 hover:text-blue-700">Back</button>
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      <p>Settings content goes here.</p>
    </div>
  );
};

export default Settings; 