export type WhyFeatureIconType = 'handmade' | 'unique' | 'quality' | 'love';

interface WhyFeatureIconProps {
  type: WhyFeatureIconType;
  className?: string;
}

export function WhyFeatureIcon({ type, className = 'h-6 w-6' }: WhyFeatureIconProps) {
  const shared = {
    className,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.6,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  };

  switch (type) {
    case 'handmade':
      return (
        <svg {...shared}>
          <path d="M8 13.5c-2.2 1.2-3.5 2.8-3.5 4.5a2.5 2.5 0 0 0 5 0c0-1.4-1.1-2.8-2.7-3.7" />
          <path d="M12 12.5c2.5-1.2 4.5-3.3 5.5-5.8.8-1.9.2-4-1.8-4.6-1.5-.5-3 .2-3.8 1.6" />
          <path d="M9.5 8.5c-.8-2.2-3-3.4-5.2-2.8-1.8.5-2.8 2.4-2.3 4.2.6 2.1 2.7 3.2 4.8 2.7" />
          <path d="M14 10.5c1.5 1.8 3.8 2.4 5.7 1.3 1.6-.9 2.2-2.9 1.4-4.6-.9-1.8-3-2.5-4.8-1.6" />
          <circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none" />
        </svg>
      );
    case 'unique':
      return (
        <svg {...shared}>
          <path d="M12 3.5l1.4 4.3h4.6l-3.7 2.7 1.4 4.3L12 12.1 8.3 14.8l1.4-4.3-3.7-2.7h4.6z" />
          <circle cx="12" cy="12" r="8.5" strokeDasharray="2.5 3" opacity="0.55" />
        </svg>
      );
    case 'quality':
      return (
        <svg {...shared}>
          <circle cx="12" cy="9.5" r="4.5" />
          <path d="M8.2 12.8 7 20.5l5-2.7 5 2.7-1.2-7.7" />
          <path d="M9.5 9.2 11 10.7l3.5-3.8" />
        </svg>
      );
    case 'love':
      return (
        <svg {...shared}>
          <path d="M12 20.5s-6.5-4.2-6.5-9a3.5 3.5 0 0 1 6-2.2A3.5 3.5 0 0 1 18.5 11.5c0 4.8-6.5 9-6.5 9z" />
          <path d="M9.5 10.5c.5 1 1.5 1.5 2.5 2.5 1-1 2-1.5 2.5-2.5" opacity="0.65" />
        </svg>
      );
    default:
      return null;
  }
}
