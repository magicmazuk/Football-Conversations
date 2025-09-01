import React from 'react';

interface WaterCoolerQuoteProps {
    quote: string;
    isLoading: boolean;
    tones: { value: string; label: string }[];
    selectedTone: string;
    onToneChange: (tone: string) => void;
}

export const WaterCoolerQuote: React.FC<WaterCoolerQuoteProps> = ({ quote, isLoading, tones, selectedTone, onToneChange }) => {
    return (
        <section className="mb-8 p-6 bg-light-card rounded-xl border border-light-border shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-4">
                <h2 className="text-sm font-semibold text-brand-green uppercase tracking-wider">
                    Quote of the Day
                </h2>
                <div className="flex items-center self-start sm:self-center">
                    <label htmlFor="tone-select" className="text-sm text-light-text-secondary mr-2 whitespace-nowrap">Talking to:</label>
                    <select
                        id="tone-select"
                        value={selectedTone}
                        onChange={(e) => onToneChange(e.target.value)}
                        className="text-sm bg-gray-100 border-light-border rounded-md py-1 pl-2 pr-8 focus:ring-2 focus:ring-brand-green focus:outline-none transition-all"
                        aria-label="Select quote tone"
                    >
                        {tones.map(tone => (
                            <option key={tone.value} value={tone.value}>{tone.label}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="text-center">
                {isLoading ? (
                     <div className="h-6 bg-gray-200 rounded-md w-3/4 mx-auto animate-pulse"></div>
                ) : (
                    <p className="text-lg italic text-light-text-secondary">
                        "{quote}"
                    </p>
                )}
            </div>
        </section>
    );
}