import Link from "next/link";
import type { Category } from "@/lib/climb";

export function ClimbList({ climb }: { climb: Category[] }) {
  return (
    <ol className="border border-ink">
      {climb.map((category) => (
          <li key={category.slug} className="border-b border-ink last:border-b-0">
            <Link
              href={`/climb/${category.slug}`}
              className="block px-4 py-3 no-underline hover:bg-ink hover:text-paper"
            >
              <span className="mr-3 font-sans text-xs tabular-nums">
                {String(category.order).padStart(2, "0")}
              </span>
              {category.name}
            </Link>
          </li>
        ))}
    </ol>
  );
}
