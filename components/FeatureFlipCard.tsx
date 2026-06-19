"use client";

import { useState } from "react";
import Image from "next/image";

interface FeatureFlipCardProps {
  imageSrc: string;
  title: string;
  flipText: string;
}

export default function FeatureFlipCard({
  imageSrc,
  title,
  flipText,
}: FeatureFlipCardProps) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="flex flex-col items-center gap-5">
      {/* Flip container */}
      <div
        className="relative w-[160px] h-[160px] md:w-[180px] md:h-[180px] cursor-pointer"
        style={{ perspective: "600px" }}
        onClick={() => setFlipped((f) => !f)}
        onMouseEnter={() => setFlipped(true)}
        onMouseLeave={() => setFlipped(false)}
      >
        <div
          className="absolute inset-0 transition-transform duration-700 ease-in-out"
          style={{
            transformStyle: "preserve-3d",
            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          {/* Front face — circular image */}
          <div
            className="absolute inset-0 rounded-full overflow-hidden border-[3px] border-stone-200/60 shadow-lg bg-white flex items-center justify-center"
            style={{ backfaceVisibility: "hidden" }}
          >
            <Image
              src={imageSrc}
              alt={title}
              fill
              className="object-cover"
              sizes="180px"
            />
          </div>

          {/* Back face — flip text */}
          <div
            className="absolute inset-0 rounded-full overflow-hidden border-[3px] border-[#E07A5F]/40 shadow-lg bg-[#FAF9F6] flex items-center justify-center p-5"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <p className="font-serif text-[11px] md:text-[12px] leading-[1.55] text-[#1C2541] text-center">
              {flipText}
            </p>
          </div>
        </div>
      </div>

      {/* Title below the circle */}
      <h3 className="font-serif text-lg md:text-xl text-[#1C2541] text-center tracking-tight">
        {title}
      </h3>
    </div>
  );
}
