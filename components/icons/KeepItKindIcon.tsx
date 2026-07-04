export function KeepItKindIcon({
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
            {/* Shield */}
            <path
                d="M32 10L49 17V30C49 42 40.5 50 32 54C23.5 50 15 42 15 30V17L32 10Z"
                fill="#14B8A6"
            />

            {/* Heart */}
            <path
                d="M27 28
        C27 25 30.5 24.5 32 27
        C33.5 24.5 37 25 37 28
        C37 31 34.5 33.2 32 35
        C29.5 33.2 27 31 27 28Z"
                fill="white"
            />

            {/* Check */}
            <path
                d="M25 39L30 44L39 34"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}