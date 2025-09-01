import React from 'react';

interface ControlsProps {
  wordCount: number;
  setWordCount: (count: number) => void;
}

const options = [
  { label: 'Brief', words: 75 },
  { label: 'Standard', words: 150 },
  { label: 'Detailed', words: 250 },
];

export const Controls: React.FC<ControlsProps> = ({ wordCount, setWordCount }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-light-text-secondary mb-2">
        Summary Length
      </label>
      <div className="flex w-full bg-gray-100 rounded-lg p-1 border border-light-border">
        {options.map((option) => (
          <button
            key={option.words}
            onClick={() => setWordCount(option.words)}
            className={`w-full text-center text-sm font-semibold py-1.5 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-brand-green ${
              wordCount === option.words
                ? 'bg-brand-green text-white shadow'
                : 'text-light-text-secondary hover:bg-gray-200'
            }`}
            aria-pressed={wordCount === option.words}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};