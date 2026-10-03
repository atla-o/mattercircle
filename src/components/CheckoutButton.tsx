"use client";

import { useEffect, useRef } from "react";

function point(deg: number, radius: number) {
  const rad = (deg * Math.PI) / 180;
  return [50 + radius * Math.cos(rad), 50 + radius * Math.sin(rad)];
}

function piece(start: number, end: number) {
  const radius = 28;
  const [x1, y1] = point(start, radius);
  const [x2, y2] = point(end, radius);
  const rad = (end * Math.PI) / 180;
  const tx = -Math.sin(rad);
  const ty = Math.cos(rad);
  const nx = Math.cos(rad);
  const ny = Math.sin(rad);
  const length = 16;
  const width = 13;
  const tip = [x2 + tx * length, y2 + ty * length];
  const left = [x2 + nx * (width / 2), y2 + ny * (width / 2)];
  const right = [x2 - nx * (width / 2), y2 - ny * (width / 2)];
  return {
    arc: `M ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2}`,
    head: `M ${left[0]} ${left[1]} L ${tip[0]} ${tip[1]} L ${right[0]} ${right[1]} Z`,
  };
}

const pieces = [0, 1, 2].map((index) => {
  const start = -90 + index * 120 + 18;
  return piece(start, start + 78);
});

export function CheckoutButton() {
  const linkRef = useRef<HTMLAnchorElement>(null);
  const turn = useRef(0);

  useEffect(() => {
    const nudge = () => {
      const link = linkRef.current;
      if (!link) {
        return;
      }
      const next = turn.current + 120;
      turn.current = next;
      link.style.transition = "none";
      link.style.transform = `rotate(${next - 120}deg)`;
      link.getBoundingClientRect();
      link.style.transition = "transform 0.55s ease";
      link.style.transform = `rotate(${next}deg)`;
    };
    window.addEventListener("mattercircle-checkout", nudge);
    return () => window.removeEventListener("mattercircle-checkout", nudge);
  }, []);

  return (
    <a
      ref={linkRef}
      href="/checkout"
      aria-label="checkout"
      className="inline-flex size-[0.72rem] shrink-0 text-ink no-underline"
    >
      <svg viewBox="0 0 100 100" className="size-full" aria-hidden="true">
        {pieces.map((item) => (
          <g key={item.arc}>
            <path
              d={item.arc}
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              strokeLinecap="butt"
            />
            <path d={item.head} fill="currentColor" />
          </g>
        ))}
      </svg>
    </a>
  );
}
