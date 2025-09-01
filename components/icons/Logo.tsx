import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 220 40"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="Watercooler FC Logo"
  >
    <text 
        x="0" 
        y="28" 
        fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'"
        fontWeight="800"
        fontSize="24"
        letterSpacing="-0.5"
        className="fill-text-primary"
    >
        WATERCOOLER
    </text>
    <g>
        <path d="M180 10 H210 L200 20 L210 30 H180 Z" className="fill-brand-primary"/>
        <text
            x="190"
            y="20.5"
            dominantBaseline="middle"
            fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'"
            fontWeight="700"
            fontSize="16"
            textAnchor="middle"
            className="fill-card-bg"
        >
            FC
        </text>
    </g>
  </svg>
);