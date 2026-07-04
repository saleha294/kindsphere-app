export function SendKindMessagesIcon({
    className = "w-16 h-16",
    fill = "#8B5CF6",
    stroke = "#FFFFFF",
}: {
    className?: string;
    fill?: string;
    stroke?: string;
}) {
    return (
        <svg
            viewBox="0 0 64 64"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            fill="none"
        >
            <rect
                x="10"
                y="16"
                width="44"
                height="32"
                rx="4"
                fill={fill}
            />
            <path
                d="M10 18L32 34L54 18"
                stroke={stroke}
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M52 38C52 38 60 30 60 25C60 22 58 20 56 20C54 20 52 22 52 22C52 22 50 20 48 20C46 20 44 22 44 25C44 30 52 38 52 38Z"
                fill="#EC4899"
                stroke="#FFFFFF"
                strokeWidth="1"
            />
        </svg>
    );
}