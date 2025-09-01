import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 200 40"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="Watercooler FC Logo"
  >
    {/* Icon */}
    <g transform="translate(0, 2)">
        <g className="text-brand-primary">
            {/* Water cooler icon part */}
            <path 
                d="M16,5 C18,5 18,3 20,3 C22,3 22,5 24,5 L16,5 Z" 
                fill="currentColor"
                className="opacity-50"
            />
            <path 
                d="M14,7 L26,7 C26,7 27,11 27,15 C27,24 13,24 13,15 C13,11 14,7 14,7 Z" 
                fill="currentColor"
            />
            {/* Soccer ball pattern on the bottle */}
            <g fill="none" stroke="#FFFFFF" strokeWidth="0.5" className="opacity-60">
                <path d="M20 10.5 l-3 1.7 v3.4 l3 1.7 l3 -1.7 v-3.4z" />
                <path d="M17 12.2 v3.4" />
                <path d="M23 12.2 v3.4" />
                <path d="M15.5 14 l3 -1.7" />
                <path d="M21.5 14 l3 -1.7" />
            </g>
            <rect x="12" y="25" width="16" height="2" rx="1" fill="currentColor" />
            <path d="M15,28 L25,28 L24,35 L16,35 Z" fill="currentColor" className="opacity-50" />
            <rect x="18" y="19" width="4" height="4" rx="1" fill="#FFFFFF" className="opacity-40" />
        </g>
    </g>
    {/* Text */}
    <text 
        x="42" 
        y="27" 
        fontFamily="sans-serif"
        fontWeight="bold" 
        fontSize="24" 
        className="fill-text-primary tracking-tight"
    >
        Watercooler
    </text>
    <text
        x="170"
        y="27"
        fontFamily="sans-serif"
        fontWeight="bold"
        fontSize="24"
        className="fill-brand-primary tracking-tight"
    >
        FC
    </text>
  </svg>
);
