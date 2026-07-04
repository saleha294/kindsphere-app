type Props = {
    className?: string;
};

export default function MutualConnectionsIcon({
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
                d="M8 50C13 47 18 53 23 50C28 47 33 53 38 50C43 47 48 53 53 50"
                stroke="#C4B5FD"
                strokeWidth="2.5"
                strokeLinecap="round"
            />

            {/* Left Bottle */}
            <g transform="rotate(-15 22 34)">
                <rect x="15" y="20" width="12" height="22" rx="6" fill="#8B5CF6" />
                <rect x="18" y="15" width="6" height="6" rx="2" fill="#8B5CF6" />
                <rect x="19" y="12" width="4" height="3" rx="1" fill="#A78BFA" />

                <rect x="18" y="27" width="6" height="6" rx="1" fill="white" />
            </g>

            {/* Right Bottle */}
            <g transform="rotate(15 42 34)">
                <rect x="37" y="20" width="12" height="22" rx="6" fill="#8B5CF6" />
                <rect x="40" y="15" width="6" height="6" rx="2" fill="#8B5CF6" />
                <rect x="41" y="12" width="4" height="3" rx="1" fill="#A78BFA" />

                <rect x="40" y="27" width="6" height="6" rx="1" fill="white" />
            </g>

            {/* Floating Heart */}
            <path
                d="M29 16
        C29 13.5 32 13 33 15
        C34 13 37 13.5 37 16
        C37 18.5 34.7 20.5 33 21.8
        C31.3 20.5 29 18.5 29 16Z"
                fill="#EC4899"
            />

            {/* Tiny Sparkles */}
            <path
                d="M12 18V21M10.5 19.5H13.5"
                stroke="#FBBF24"
                strokeWidth="1.8"
                strokeLinecap="round"
            />

            <path
                d="M52 16V19M50.5 17.5H53.5"
                stroke="#FBBF24"
                strokeWidth="1.8"
                strokeLinecap="round"
            />
        </svg>
    );
}