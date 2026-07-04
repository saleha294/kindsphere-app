export function FeelConnectedIcon({
    className,
}: {
    className?: string;
}) {
    return (
        <svg
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            {/* Left Person */}
            <circle
                cx="24"
                cy="24"
                r="6"
                fill="#8B5CF6"
            />

            <path
                d="M16 42C16 36.5 20 33 24 33C28 33 32 36.5 32 42"
                fill="#8B5CF6"
            />

            {/* Right Person */}
            <circle
                cx="40"
                cy="24"
                r="6"
                fill="#A78BFA"
            />

            <path
                d="M32 42C32 36.5 36 33 40 33C44 33 48 36.5 48 42"
                fill="#A78BFA"
            />

            {/* Heart */}
            <path
                d="M28 14
        C28 11.8 31 11.2 32 13.2
        C33 11.2 36 11.8 36 14
        C36 16.2 33.5 18.2 32 19.4
        C30.5 18.2 28 16.2 28 14Z"
                fill="#EC4899"
            />

            {/* Sparkle */}
            <path
                d="M50 16L51 19L54 20L51 21L50 24L49 21L46 20L49 19L50 16Z"
                fill="#FBBF24"
            />
        </svg>
    );
}