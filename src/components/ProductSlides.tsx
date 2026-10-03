"use client";

import { useState } from "react";

const marks = [
  <circle key="a" cx="80" cy="70" r="28" fill="none" stroke="currentColor" strokeWidth="2" />,
  <rect key="b" x="52" y="42" width="56" height="56" fill="none" stroke="currentColor" strokeWidth="2" />,
  <path key="c" d="M40 100 L80 36 L120 100 Z" fill="none" stroke="currentColor" strokeWidth="2" />,
];

export function ProductSlides() {
  const [index, setIndex] = useState(0);

  return (
    <div className="mt-6 flex w-full min-h-0 flex-1 flex-col">
      <svg
        viewBox="0 0 160 140"
        role="img"
        aria-label={`image ${index + 1} of 3`}
        className="h-full min-h-64 w-full flex-1 border border-ink text-ink"
      >
        {marks[index]}
      </svg>
      <div className="mt-1 flex justify-center gap-4 font-sans text-xs">
        {[0, 1, 2].map((slide) => (
          <button
            key={slide}
            type="button"
            onClick={() => setIndex(slide)}
            className="underline-offset-2"
            aria-label={`image ${slide + 1}`}
          >
            {slide + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
