import React, { useState } from 'react';
import { apiKeyManager } from '../services/apiKeyManager';
import { InfoIcon } from './icons/InfoIcon';

interface ApiKeyBannerProps {
    onKeySaved: () => void;
}

export const ApiKeyBanner: React.FC<ApiKeyBannerProps> = ({ onKeySaved }) => {
    const [apiKey, setApiKey] = useState('');

    const handleSave = () => {
        if (apiKey.trim()) {
            apiKeyManager.setApiKey(apiKey.trim());
            onKeySaved();
        }
    };

    return (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 mb-6 rounded-r-lg shadow" role="alert">
            <div className="flex items-start">
                <InfoIcon className="w-6 h-6 mr-3 text-yellow-600" />
                <div>
                    <p className="font-bold">Gemini API Key Required</p>
                    <p className="text-sm">
                        To use the AI features of this app, please provide your Google Gemini API key.
                        It will be stored in your browser's session storage and will be cleared when you close this tab.
                    </p>
                    <div className="mt-3 flex flex-col sm:flex-row gap-2 items-center">
                        <input
                            type="password"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            placeholder="Paste your API key here"
                            className="w-full sm:w-auto flex-grow px-3 py-1.5 border border-yellow-400 rounded-md focus:ring-2 focus:ring-yellow-500 focus:outline-none text-sm text-yellow-900 placeholder-yellow-600 bg-yellow-50"
                            aria-label="Gemini API Key"
                        />
                        <button
                            onClick={handleSave}
                            className="w-full sm:w-auto px-4 py-1.5 bg-yellow-500 text-white font-semibold rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-yellow-100 focus:ring-yellow-600 transition-colors text-sm"
                        >
                            Save & Continue
                        </button>
                    </div>
                     <a
                        href="https://aistudio.google.com/app/apikey"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-yellow-700 hover:text-yellow-900 hover:underline mt-2 inline-block"
                    >
                        Get a Gemini API key from Google AI Studio &rarr;
                    </a>
                </div>
            </div>
        </div>
    );
};
