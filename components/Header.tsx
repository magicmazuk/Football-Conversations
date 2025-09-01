import React from 'react';
import { Logo } from './icons/Logo';

export const Header: React.FC = () => {
  return (
    <header className="bg-card-bg/80 backdrop-blur-sm sticky top-0 z-20 border-b border-border-color">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <Logo className="h-8 w-auto text-text-primary" />
          <p className="text-text-secondary mt-1 sm:mt-0">Your AI-powered briefing for office banter.</p>
        </div>
      </div>
    </header>
  );
};
