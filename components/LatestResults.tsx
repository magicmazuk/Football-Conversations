import React from 'react';
import { TrophyIcon } from './icons/TrophyIcon';
import { TrendingUpIcon } from './icons/TrendingUpIcon';

interface LatestResultsProps {
  results: string[];
  form: string;
}

export const LatestResults: React.FC<LatestResultsProps> = ({ results, form }) => {
  if (!results || results.length === 0) return null;

  return (
    <div className="bg-gray-50 p-5 rounded-xl border border-light-border">
      <h3 className="text-lg font-semibold text-light-text mb-3 flex items-center justify-between">
        <div className="flex items-center">
            <TrophyIcon className="w-5 h-5 text-gray-500"/>
            <span className="ml-2">Recent Form</span>
        </div>
        {form && (
            <div className="flex items-center text-sm font-medium text-light-text-secondary">
                <TrendingUpIcon className="w-4 h-4 mr-1.5" />
                <span className="font-mono tracking-widest">{form}</span>
            </div>
        )}
      </h3>
      <ul className="space-y-2 list-none text-light-text-secondary">
        {results.map((result, index) => (
          <li key={index} className="text-sm">{result}</li>
        ))}
      </ul>
    </div>
  );
};
