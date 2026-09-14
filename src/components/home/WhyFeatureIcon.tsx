export type WhyFeatureIconType = 'local' | 'makers' | 'stories' | 'unique';

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
    case 'local':
      return (
        <svg {...shared}>
          <path d="M12 21s-7-5.2-7-11a7 7 0 1 1 14 0c0 5.8-7 11-7 11z" />
          <circle cx="12" cy="10" r="2.4" />
        </svg>
      );
    case 'makers':
      return (
        <svg {...shared}>
          <circle cx="9" cy="8" r="2.4" />
          <path d="M4.5 18c.4-2.6 2.4-4 4.5-4s4.1 1.4 4.5 4" />
          <circle cx="16.5" cy="8.5" r="2" />
          <path d="M14.2 14.2c1.2-.7 2.7-.8 4.1.1.9.6 1.5 1.6 1.7 2.7" />
          <path d="M15.2 11.2 17 13l3-3.2" />
        </svg>
      );
    case 'stories':
      return (
        <svg {...shared}>
          <path d="M12 20.5s-6.5-4.2-6.5-9a3.5 3.5 0 0 1 6-2.2A3.5 3.5 0 0 1 18.5 11.5c0 4.8-6.5 9-6.5 9z" />
          <path d="M10 11.5h4M12 9.5v4" opacity="0.7" />
        </svg>
      );
    case 'unique':
      return (
        <svg {...shared}>
          <path d="M12 3.5l1.4 4.3h4.6l-3.7 2.7 1.4 4.3L12 12.1 8.3 14.8l1.4-4.3-3.7-2.7h4.6z" />
          <path d="M4.5 5.5 5.2 7.2 6.9 7.9 5.2 8.6 4.5 10.3 3.8 8.6 2.1 7.9 3.8 7.2z" />
          <path d="M19 14.5 19.5 15.7 20.7 16.2 19.5 16.7 19 17.9 18.5 16.7 17.3 16.2 18.5 15.7z" />
        </svg>
      );
    default:
      return null;
  }
}
