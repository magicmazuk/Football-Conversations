import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-light-card/80 backdrop-blur-sm sticky top-0 z-20 border-b border-light-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-light-text tracking-tight">
            Footy<span className="text-brand-green">Feed</span>
          </h1>
          <p className="text-light-text-secondary mt-1 sm:mt-0">Your weekly AI-powered football briefing</p>
        </div>
      </div>
    </header>
  );
};