import React from 'react';
import { Logo } from './icons/Logo';
import { SettingsIcon } from './icons/SettingsIcon';

interface HeaderProps {
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSettings }) => {
  return (
    <header className="bg-card-bg/80 backdrop-blur-sm sticky top-0 z-20 border-b border-border-color">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Logo className="h-8 w-auto text-text-primary" />
          </div>
          <div className="flex items-center gap-4">
            <p className="text-text-secondary hidden sm:block">Your AI-powered briefing for office banter.</p>
            <button 
              onClick={onOpenSettings} 
              className="text-text-secondary hover:text-text-primary p-2 rounded-full hover:bg-gray-200 transition-colors"
              aria-label="Open settings"
              title="Open settings"
            >
              <SettingsIcon className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};