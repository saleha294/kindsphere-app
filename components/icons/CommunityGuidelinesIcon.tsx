export function CommunityGuidelinesIcon({
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
            {/* Heart */}
            <path
                d="M24 24
        C24 20 29 19 32 23
        C35 19 40 20 40 24
        C40 28 36.5 31.5 32 35
        C27.5 31.5 24 28 24 24Z"
                fill="#EC4899"
            />

            {/* Left Hand */}
            <path
                d="M17 39
        C20 35 24 34 28 36
        L31 38
        C29 42 24 44 19 43
        C17.5 42.8 16.5 40.8 17 39Z"
                fill="#8B5CF6"
            />

            {/* Right Hand */}
            <path
                d="M47 39
        C44 35 40 34 36 36
        L33 38
        C35 42 40 44 45 43
        C46.5 42.8 47.5 40.8 47 39Z"
                fill="#A78BFA"
            />

            {/* Circle */}
            <circle
                cx="32"
                cy="30"
                r="18"
                stroke="#DDD6FE"
                strokeWidth="2"
            />
        </svg>
    );
}