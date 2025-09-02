import React, { useState, useEffect } from 'react';
import { CloseIcon } from './icons/CloseIcon';
import { apiKeyManager, AiProvider } from '../services/apiKeyManager';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, onSave }) => {
    const [activeProvider, setActiveProvider] = useState<AiProvider>('gemini');
    const [openaiApiKey, setOpenaiApiKey] = useState('');

    useEffect(() => {
        if (isOpen) {
            setActiveProvider(apiKeyManager.getActiveProvider());
            setOpenaiApiKey(apiKeyManager.getApiKey('openai') || '');
        }
    }, [isOpen]);

    const handleSave = () => {
        apiKeyManager.setActiveProvider(activeProvider);
        // Do not save Gemini key, it's managed by environment variables.
        apiKeyManager.setApiKey('openai', openaiApiKey);
        onSave();
    };
    
    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
           if (event.key === 'Escape') {
              onClose();
           }
        };
        window.addEventListener('keydown', handleEsc);
        return () => {
           window.removeEventListener('keydown', handleEsc);
        };
    }, [onClose]);

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center animate-fade-in" 
            onClick={onClose} 
            role="dialog" 
            aria-modal="true"
            aria-labelledby="settings-title"
        >
            <div className="bg-card-bg rounded-xl shadow-2xl w-full max-w-lg m-4" onClick={e => e.stopPropagation()}>
                <div className="p-5 border-b border-border-color flex justify-between items-center">
                    <h2 id="settings-title" className="text-xl font-bold text-text-primary">Settings</h2>
                    <button onClick={onClose} className="text-text-secondary hover:text-text-primary p-1 rounded-full hover:bg-gray-200 transition-colors" aria-label="Close modal">
                        <CloseIcon />
                    </button>
                </div>
                <div className="p-5 space-y-6">
                    <div>
                        <label className="block text-base font-semibold text-text-primary mb-2">AI Provider</label>
                        <fieldset className="flex flex-col sm:flex-row gap-2">
                            <legend className="sr-only">Choose your AI Provider</legend>
                            <div>
                                <input type="radio" id="gemini" name="provider" value="gemini" checked={activeProvider === 'gemini'} onChange={() => setActiveProvider('gemini')} className="sr-only peer"/>
                                <label htmlFor="gemini" className="block w-full text-center px-4 py-2 border rounded-lg cursor-pointer peer-checked:bg-brand-primary peer-checked:text-white peer-checked:border-brand-primary-dark hover:bg-gray-100">Google Gemini</label>
                            </div>
                            <div>
                                <input type="radio" id="openai" name="provider" value="openai" checked={activeProvider === 'openai'} onChange={() => setActiveProvider('openai')} className="sr-only peer"/>
                                <label htmlFor="openai" className="block w-full text-center px-4 py-2 border rounded-lg cursor-pointer peer-checked:bg-brand-primary peer-checked:text-white peer-checked:border-brand-primary-dark hover:bg-gray-100">OpenAI ChatGPT</label>
                            </div>
                        </fieldset>
                    </div>

                    {activeProvider === 'gemini' && (
                        // Per guidelines, Gemini API key should not be configurable in the UI.
                        <div className="animate-fade-in p-4 bg-gray-100 rounded-lg border border-border-color">
                            <p className="text-sm font-medium text-text-secondary">
                                The Google Gemini API key is configured securely via an environment variable
                                (<code className="text-xs bg-gray-200 p-1 rounded">process.env.API_KEY</code>)
                                and cannot be changed here.
                            </p>
                        </div>
                    )}

                    {activeProvider === 'openai' && (
                         <div className="animate-fade-in">
                            <label htmlFor="openai-key" className="block text-sm font-medium text-text-secondary mb-1">OpenAI API Key</label>
                            <input
                                id="openai-key"
                                type="password"
                                value={openaiApiKey}
                                onChange={(e) => setOpenaiApiKey(e.target.value)}
                                placeholder="Enter your OpenAI API key"
                                className="w-full px-3 py-2 border border-border-color rounded-md focus:ring-2 focus:ring-brand-primary focus:outline-none"
                            />
                            <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline mt-1 inline-block">Get an OpenAI API key &rarr;</a>
                        </div>
                    )}
                </div>
                <div className="p-5 bg-gray-50 border-t border-border-color flex justify-end">
                    <button
                        onClick={handleSave}
                        className="px-6 py-2 bg-brand-primary text-white font-semibold rounded-md hover:bg-brand-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-brand-primary"
                    >
                        Save and Reload
                    </button>
                </div>
            </div>
        </div>
    );
};
