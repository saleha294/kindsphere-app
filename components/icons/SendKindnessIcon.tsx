export function SendKindnessIcon({
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
            {/* Paper Plane */}
            <path
                d="M11 31L52 14C53.5 13.4 54.8 14.9 54.1 16.3L37.8 50.2C37.1 51.7 35.1 51.4 34.7 49.8L31.3 37.5L19 34.2C17.4 33.8 17.1 31.8 18.6 31.1L52 16"
                fill="#8B5CF6"
            />

            {/* Fold */}
            <path
                d="M31 37L53 15"
                stroke="white"
                strokeWidth="2.2"
                strokeLinecap="round"
            />

            {/* Heart */}
            <path
                d="M15 16
        C15 13.7 18 13 19 15
        C20 13 23 13.7 23 16
        C23 18.2 20.5 20.2 19 21.4
        C17.5 20.2 15 18.2 15 16Z"
                fill="#EC4899"
            />

            {/* Sparkle */}
            <path
                d="M46 46L47 49L50 50L47 51L46 54L45 51L42 50L45 49L46 46Z"
                fill="#FBBF24"
            />
        </svg>
    );
}