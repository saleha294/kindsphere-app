export function AboutThisProjectIcon({
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
            {/* Left Page */}
            <path
                d="M14 18C14 15.8 15.8 14 18 14H30C33 14 35 16 35 19V48H20C16.7 48 14 45.3 14 42V18Z"
                fill="#8B5CF6"
            />

            {/* Right Page */}
            <path
                d="M50 18C50 15.8 48.2 14 46 14H34C31 14 29 16 29 19V48H44C47.3 48 50 45.3 50 42V18Z"
                fill="#A78BFA"
            />

            {/* Heart */}
            <path
                d="M28 28
        C28 25.5 31 25 32 27
        C33 25 36 25.5 36 28
        C36 30.5 34 32.5 32 34
        C30 32.5 28 30.5 28 28Z"
                fill="#EC4899"
            />

            {/* Sparkle */}
            <path
                d="M48 10L49 13L52 14L49 15L48 18L47 15L44 14L47 13L48 10Z"
                fill="#FBBF24"
            />
        </svg>
    );
}