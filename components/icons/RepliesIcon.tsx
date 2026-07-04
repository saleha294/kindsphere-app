type Props = {
    className?: string;
};

export default function RepliesIcon({
    className = "w-11 h-11",
}: Props) {
    return (
        <svg
            viewBox="0 0 64 64"
            className={className}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Waves */}
            <path
                d="M10 49C15 46 20 52 25 49C30 46 35 52 40 49C45 46 50 52 55 49"
                stroke="#C4B5FD"
                strokeWidth="2.5"
                strokeLinecap="round"
            />

            {/* Bottle */}
            <g transform="rotate(-18 32 32)">
                <rect
                    x="24"
                    y="16"
                    width="16"
                    height="28"
                    rx="8"
                    fill="#8B5CF6"
                />

                <rect
                    x="28"
                    y="10"
                    width="8"
                    height="8"
                    rx="2"
                    fill="#8B5CF6"
                />

                <rect
                    x="29"
                    y="6"
                    width="6"
                    height="4"
                    rx="1"
                    fill="#A78BFA"
                />

                {/* Letter */}
                <rect
                    x="27"
                    y="24"
                    width="10"
                    height="9"
                    rx="1.5"
                    fill="white"
                />

                <line
                    x1="29"
                    y1="27"
                    x2="35"
                    y2="27"
                    stroke="#DDD6FE"
                    strokeWidth="1.3"
                    strokeLinecap="round"
                />

                <line
                    x1="29"
                    y1="30"
                    x2="34"
                    y2="30"
                    stroke="#DDD6FE"
                    strokeWidth="1.3"
                    strokeLinecap="round"
                />
            </g>

            {/* Reply Arrow */}
            <path
                d="M51 18
           C56 18 58 21 58 25
           C58 30 54 33 48 33
           H43"
                stroke="#EC4899"
                strokeWidth="2.6"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            {/* Arrow Head */}
            <path
                d="M46 29L42 33L46 37"
                stroke="#EC4899"
                strokeWidth="2.6"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            {/* Sparkle */}
            <path
                d="M14 16V20M12 18H16"
                stroke="#FBBF24"
                strokeWidth="2"
                strokeLinecap="round"
            />
        </svg>
    );
}