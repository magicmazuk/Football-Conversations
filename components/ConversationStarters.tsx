import React from 'react';
import { ChatBubbleIcon } from './icons/ChatBubbleIcon';

interface ConversationStartersProps {
  starters: string[];
}

export const ConversationStarters: React.FC<ConversationStartersProps> = ({ starters }) => {
  return (
    <div className="bg-gray-50 p-5 rounded-xl border border-light-border">
      <h3 className="text-lg font-semibold text-light-text mb-3 flex items-center">
        <ChatBubbleIcon />
        <span className="ml-2">Water Cooler Banter</span>
      </h3>
      <ul className="space-y-2 list-disc list-inside text-light-text">
        {starters.map((starter, index) => (
          <li key={index}>{starter}</li>
        ))}
      </ul>
    </div>
  );
};