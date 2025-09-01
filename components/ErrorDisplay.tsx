import React from 'react';
import { AlertTriangleIcon } from './icons/AlertTriangleIcon';
import { CloseIcon } from './icons/CloseIcon';
import { isRateLimitError } from '../services/errorService';

interface ErrorDisplayProps {
    error: Error;
    onClose: () => void;
    onShowApiKeyForm: () => void;
}

const GenericErrorContent: React.FC<{ onShowApiKeyForm: () => void }> = ({ onShowApiKeyForm }) => (
    <>
        <p className="font-bold">An Unexpected Error Occurred</p>
        <p className="text-sm">This is often caused by a missing, invalid, or restricted API key.</p>
        <div className="mt-3 flex flex-wrap gap-2">
            <button
                onClick={onShowApiKeyForm}
                className="px-3 py-1.5 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-red-100 focus:ring-red-600 transition-colors text-sm"
            >
                Set API Key
            </button>
        </div>
    </>
);

const RateLimitErrorContent: React.FC = () => (
    <>
        <p className="font-bold">API Rate Limit Exceeded</p>
        <p className="text-sm">You've exceeded your current quota for the Gemini API. Please check your billing details and usage limits.</p>
        <div className="mt-3 flex flex-wrap gap-2">
            <a
                href="https://aistudio.google.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-red-100 focus:ring-red-600 transition-colors text-sm"
            >
                Check Google AI Studio
            </a>
            <a
                href="https://ai.google.dev/gemini-api/docs/rate-limits"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-transparent border border-red-500 text-red-600 font-semibold rounded-md hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-red-100 focus:ring-red-600 transition-colors text-sm"
            >
                View Rate Limits
            </a>
        </div>
    </>
);

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error, onClose, onShowApiKeyForm }) => {
    const isRateLimited = isRateLimitError(error);

    return (
        <div className="fixed bottom-4 right-4 z-50 w-full max-w-lg animate-fade-in" role="alert">
            <div className="bg-red-100 border-l-4 border-red-500 text-red-800 p-4 rounded-r-lg shadow-lg">
                <div className="flex items-start">
                    <AlertTriangleIcon className="w-6 h-6 mr-3 text-red-600" />
                    <div className="flex-grow">
                        {isRateLimited ? (
                            <RateLimitErrorContent />
                        ) : (
                            <GenericErrorContent onShowApiKeyForm={onShowApiKeyForm} />
                        )}
                        <details className="text-xs w-full mt-3">
                            <summary className="cursor-pointer text-red-700 hover:underline">Show Technical Details</summary>
                            <pre className="mt-2 p-2 bg-red-50 text-red-900 rounded text-xs whitespace-pre-wrap break-words">
                                <strong>Message:</strong> {error.message || 'No message available.'}
                                <br /><br />
                                <strong>Stack Trace:</strong><br />
                                {error.stack || 'No stack trace available.'}
                            </pre>
                        </details>
                    </div>
                    <button onClick={onClose} className="ml-2 p-1 rounded-full hover:bg-red-200" aria-label="Dismiss error">
                        <CloseIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};