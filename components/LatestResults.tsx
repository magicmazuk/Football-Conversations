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
    <div className="bg-gray-50 p-4 rounded-xl border border-border-color">
      <h3 className="text-lg font-semibold text-text-primary mb-2 flex items-center justify-between">
        <div className="flex items-center">
            <TrophyIcon className="w-5 h-5 text-gray-500"/>
            <span className="ml-2">Recent Form</span>
        </div>
        {form && (
            <div className="flex items-center text-sm font-medium text-text-secondary">
                <TrendingUpIcon className="w-4 h-4 mr-1.5" />
                <span className="font-mono tracking-widest">{form}</span>
            </div>
        )}
      </h3>
      <ul className="space-y-1.5 list-none text-text-secondary">
        {results.map((result, index) => (
          <li key={index} className="text-sm">{result}</li>
        ))}
      </ul>
    </div>
  );
};