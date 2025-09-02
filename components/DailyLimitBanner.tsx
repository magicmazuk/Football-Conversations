
import React from 'react';
import { CalendarIcon } from './icons/CalendarIcon';

export const DailyLimitBanner: React.FC = () => {
    return (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-800 p-4 mb-6 rounded-r-lg shadow animate-fade-in" role="alert">
            <div className="flex items-start">
                <CalendarIcon className="w-6 h-6 mr-3 text-red-600" />
                <div>
                    <p className="font-bold">Gemini Daily API Limit Reached</p>
                    <p className="text-sm">
                        You have reached the daily request limit for the Gemini API. All AI features for this provider have been disabled.
                        Please try again tomorrow when the quota resets, or switch to a different AI provider in Settings.
                    </p>
                     <a
                        href="https://ai.google.dev/gemini-api/docs/rate-limits"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-red-700 hover:text-red-900 hover:underline mt-2 inline-block font-semibold"
                    >
                        Learn more about Gemini API rate limits &rarr;
                    </a>
                </div>
            </div>
        </div>
    );
};
