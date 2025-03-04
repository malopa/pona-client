import React from 'react';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = "h-8 w-8" }) => {
  return (
    <svg 
      viewBox="0 0 100 100" 
      className={className}
      aria-label="Pona Health Logo"
    >
      {/* Main Circle Arc */}
      <path
        d="M 95 50 A 45 45 0 1 1 50 5"
        fill="none"
        stroke="currentColor"
        strokeWidth="10"
        strokeLinecap="round"
        className="text-emerald-600"
      />
      
      {/* Medical Cross */}
      <g transform="translate(75, 25)" className="text-emerald-600">
        <rect
          x="-12"
          y="-3"
          width="24"
          height="6"
          fill="currentColor"
        />
        <rect
          x="-3"
          y="-12"
          width="6"
          height="24"
          fill="currentColor"
        />
      </g>
    </svg>
  );
};

export default Logo;