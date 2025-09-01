import React from 'react';
import { SummaryData } from '../types';
import { LinkIcon } from './icons/LinkIcon';

interface SummaryCardProps {
  data: SummaryData;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({ data }) => {
  return (
    <div className="bg-gray-50 p-4 rounded-xl border border-border-color">
      <h3 className="text-xl font-semibold text-brand-primary mb-2 italic">
        "{data.headline}"
      </h3>
      <p className="text-text-primary whitespace-pre-wrap leading-relaxed">{data.summary}</p>
      {data.citations.length > 0 && (
        <div className="mt-4 pt-3 border-t border-border-color">
          <h4 className="text-sm font-semibold text-text-secondary mb-2">Sources:</h4>
          <ul className="space-y-1">
            {data.citations.slice(0, 3).map((citation, index) => (
              <li key={index}>
                <a
                  href={citation.uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                >
                  <LinkIcon />
                  <span className="truncate ml-2">{citation.title}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};