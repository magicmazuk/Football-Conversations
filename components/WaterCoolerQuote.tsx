import React from 'react';
import { LoadingSpinner } from './icons/LoadingSpinner';

interface WaterCoolerQuoteProps {
    quote: string;
    isLoading: boolean;
    tones: { value: string; label: string }[];
    selectedTone: string;
    onToneChange: (tone: string) => void;
    error?: string | null;
}

export const WaterCoolerQuote: React.FC<WaterCoolerQuoteProps> = ({ quote, isLoading, tones, selectedTone, onToneChange, error }) => {
    return (
        <section className="mb-6 p-5 bg-card-bg rounded-xl border border-border-color shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-3">
                <h2 className="text-sm font-semibold text-brand-primary uppercase tracking-wider">
                    Quote of the Day
                </h2>
                <div className="flex items-center self-start sm:self-center">
                    <label htmlFor="tone-select" className="text-sm text-text-secondary mr-2 whitespace-nowrap">Talking to:</label>
                    <select
                        id="tone-select"
                        value={selectedTone}
                        onChange={(e) => onToneChange(e.target.value)}
                        className="text-sm bg-gray-100 border-border-color rounded-md py-1 pl-2 pr-8 focus:ring-2 focus:ring-brand-primary focus:outline-none transition-all"
                        aria-label="Select quote tone"
                    >
                        {tones.map(tone => (
                            <option key={tone.value} value={tone.value}>{tone.label}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="text-center min-h-[28px] flex items-center justify-center">
                {isLoading ? (
                     <LoadingSpinner className="h-6 w-6 text-text-secondary" />
                ) : error ? (
                    <div className="text-red-600 bg-red-100 p-3 rounded-lg border border-red-200 text-sm text-left w-full">
                        <p className="font-bold">Oops, quote generation failed!</p>
                        <p>{error}</p>
                    </div>
                ) : (
                    <p className="text-lg italic text-text-secondary">
                        "{quote}"
                    </p>
                )}
            </div>
        </section>
    );
}