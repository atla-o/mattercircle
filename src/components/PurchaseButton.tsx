"use client";

import { addCheckout } from "@/lib/checkout";

export function PurchaseButton({
  slug,
  n,
  categoryName,
}: {
  slug: string;
  n: string;
  categoryName: string;
}) {
  const href = `/checkout?add=${encodeURIComponent(slug)}&n=${encodeURIComponent(n)}&name=${encodeURIComponent(categoryName)}`;

  return (
    <a
      href={href}
      onClick={(event) => {
        event.preventDefault();
        addCheckout({ slug, n, categoryName });
      }}
      className="mt-3 inline-block border border-ink px-4 py-2 font-sans text-sm no-underline"
    >
      purchase
    </a>
  );
}
