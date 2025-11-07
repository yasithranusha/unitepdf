interface LogoProps {
  size?: number;
  className?: string;
}

export function Logo({ size = 48, className = "" }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Rounded square background - Primary Blue */}
      <rect width="200" height="200" rx="40" fill="oklch(0.55 0.22 264)" />

      {/* Overlapping documents design representing PDF merging */}
      <g transform="translate(100, 100)">
        {/* Back document (darkest) */}
        <g transform="translate(-15, -20) rotate(-8)">
          <rect
            x="-25"
            y="-35"
            width="50"
            height="70"
            rx="4"
            fill="oklch(0.65 0.18 264)"
          />
          <rect
            x="-18"
            y="-28"
            width="36"
            height="3"
            rx="1.5"
            fill="white"
            opacity="0.5"
          />
          <rect
            x="-18"
            y="-20"
            width="36"
            height="3"
            rx="1.5"
            fill="white"
            opacity="0.5"
          />
          <rect
            x="-18"
            y="-12"
            width="30"
            height="3"
            rx="1.5"
            fill="white"
            opacity="0.5"
          />
        </g>

        {/* Middle document */}
        <g transform="translate(0, -10)">
          <rect
            x="-25"
            y="-35"
            width="50"
            height="70"
            rx="4"
            fill="oklch(0.72 0.16 264)"
          />
          <rect
            x="-18"
            y="-28"
            width="36"
            height="3"
            rx="1.5"
            fill="white"
            opacity="0.6"
          />
          <rect
            x="-18"
            y="-20"
            width="36"
            height="3"
            rx="1.5"
            fill="white"
            opacity="0.6"
          />
          <rect
            x="-18"
            y="-12"
            width="30"
            height="3"
            rx="1.5"
            fill="white"
            opacity="0.6"
          />
        </g>

        {/* Front document (lightest) with arrow */}
        <g transform="translate(15, 0) rotate(8)">
          <rect
            x="-25"
            y="-35"
            width="50"
            height="70"
            rx="4"
            fill="oklch(0.80 0.14 264)"
          />
          <rect
            x="-18"
            y="-28"
            width="36"
            height="3"
            rx="1.5"
            fill="oklch(0.55 0.22 264)"
            opacity="0.4"
          />
          <rect
            x="-18"
            y="-20"
            width="36"
            height="3"
            rx="1.5"
            fill="oklch(0.55 0.22 264)"
            opacity="0.4"
          />
          <rect
            x="-18"
            y="-12"
            width="30"
            height="3"
            rx="1.5"
            fill="oklch(0.55 0.22 264)"
            opacity="0.4"
          />
        </g>

        {/* Merge arrow pointing right */}
        <g transform="translate(0, 40)">
          <circle cx="0" cy="0" r="16" fill="white" />
          <path
            d="M -4 0 L 4 0 M 4 0 L 0 -4 M 4 0 L 0 4"
            stroke="oklch(0.55 0.22 264)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </g>
      </g>
    </svg>
  );
}

export function LogoIcon({ size = 24, className = "" }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Rounded square background - Primary Blue */}
      <rect width="200" height="200" rx="40" fill="oklch(0.55 0.22 264)" />

      {/* Overlapping documents design representing PDF merging */}
      <g transform="translate(100, 100)">
        {/* Back document (darkest) */}
        <g transform="translate(-15, -20) rotate(-8)">
          <rect
            x="-25"
            y="-35"
            width="50"
            height="70"
            rx="4"
            fill="oklch(0.65 0.18 264)"
          />
          <rect
            x="-18"
            y="-28"
            width="36"
            height="3"
            rx="1.5"
            fill="white"
            opacity="0.5"
          />
          <rect
            x="-18"
            y="-20"
            width="36"
            height="3"
            rx="1.5"
            fill="white"
            opacity="0.5"
          />
          <rect
            x="-18"
            y="-12"
            width="30"
            height="3"
            rx="1.5"
            fill="white"
            opacity="0.5"
          />
        </g>

        {/* Middle document */}
        <g transform="translate(0, -10)">
          <rect
            x="-25"
            y="-35"
            width="50"
            height="70"
            rx="4"
            fill="oklch(0.72 0.16 264)"
          />
          <rect
            x="-18"
            y="-28"
            width="36"
            height="3"
            rx="1.5"
            fill="white"
            opacity="0.6"
          />
          <rect
            x="-18"
            y="-20"
            width="36"
            height="3"
            rx="1.5"
            fill="white"
            opacity="0.6"
          />
          <rect
            x="-18"
            y="-12"
            width="30"
            height="3"
            rx="1.5"
            fill="white"
            opacity="0.6"
          />
        </g>

        {/* Front document (lightest) with arrow */}
        <g transform="translate(15, 0) rotate(8)">
          <rect
            x="-25"
            y="-35"
            width="50"
            height="70"
            rx="4"
            fill="oklch(0.80 0.14 264)"
          />
          <rect
            x="-18"
            y="-28"
            width="36"
            height="3"
            rx="1.5"
            fill="oklch(0.55 0.22 264)"
            opacity="0.4"
          />
          <rect
            x="-18"
            y="-20"
            width="36"
            height="3"
            rx="1.5"
            fill="oklch(0.55 0.22 264)"
            opacity="0.4"
          />
          <rect
            x="-18"
            y="-12"
            width="30"
            height="3"
            rx="1.5"
            fill="oklch(0.55 0.22 264)"
            opacity="0.4"
          />
        </g>

        {/* Merge arrow pointing right */}
        <g transform="translate(0, 40)">
          <circle cx="0" cy="0" r="16" fill="white" />
          <path
            d="M -4 0 L 4 0 M 4 0 L 0 -4 M 4 0 L 0 4"
            stroke="oklch(0.55 0.22 264)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </g>
      </g>
    </svg>
  );
}
