export function ShareAnonymouslyIcon({
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
      {/* Chat Bubble */}
      <path
        d="M18 18C18 14.7 20.7 12 24 12H40C43.3 12 46 14.7 46 18V31C46 34.3 43.3 37 40 37H31L24 44V37H24C20.7 37 18 34.3 18 31V18Z"
        fill="#8B5CF6"
      />

      {/* Anonymous Mask */}
      <path
        d="M26 22C26 18.8 28.8 17 32 17C35.2 17 38 18.8 38 22V26C38 29.2 35.2 31 32 31C28.8 31 26 29.2 26 26V22Z"
        fill="white"
      />

      {/* Eyes */}
      <circle cx="29.5" cy="24" r="1.2" fill="#8B5CF6" />
      <circle cx="34.5" cy="24" r="1.2" fill="#8B5CF6" />

      {/* Smile */}
      <path
        d="M29 27C30 28.2 34 28.2 35 27"
        stroke="#8B5CF6"
        strokeWidth="1.6"
        strokeLinecap="round"
      />

      {/* Heart */}
      <path
        d="M46 18
        C46 15.8 49 15.3 50 17.3
        C51 15.3 54 15.8 54 18
        C54 20.2 51.5 22.2 50 23.3
        C48.5 22.2 46 20.2 46 18Z"
        fill="#EC4899"
      />
    </svg>
  );
}