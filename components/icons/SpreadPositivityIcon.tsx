export function SpreadPositivityIcon({
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
            {/* Sun */}
            <circle
                cx="32"
                cy="32"
                r="11"
                fill="#FBBF24"
            />

            {/* Heart */}
            <path
                d="M28 31
        C28 28.5 31 28 32 30
        C33 28 36 28.5 36 31
        C36 33.4 33.7 35.3 32 36.5
        C30.3 35.3 28 33.4 28 31Z"
                fill="white"
            />

            {/* Rays */}
            <path d="M32 12V18" stroke="#FBBF24" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M32 46V52" stroke="#FBBF24" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M12 32H18" stroke="#FBBF24" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M46 32H52" stroke="#FBBF24" strokeWidth="2.5" strokeLinecap="round" />

            <path d="M18 18L22 22" stroke="#FBBF24" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M42 42L46 46" stroke="#FBBF24" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M18 46L22 42" stroke="#FBBF24" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M42 22L46 18" stroke="#FBBF24" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
    );
}