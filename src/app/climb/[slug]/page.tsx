import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategory } from "@/lib/climb";
import { shownClimb } from "@/lib/shown";
import { slotLabel } from "@/lib/slot";

type ClimbPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return shownClimb().map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({
  params,
}: ClimbPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) {
    return { title: "Climb" };
  }
  return {
    title: category.name,
    description: category.summary,
  };
}

export default async function ClimbPage({ params }: ClimbPageProps) {
  const { slug } = await params;
  const climb = shownClimb();
  const category = climb.find((item) => item.slug === slug);
  if (!category) {
    notFound();
  }
  const index = climb.findIndex((item) => item.slug === slug);
  const previous = index > 0 ? climb[index - 1] : undefined;
  const next = index >= 0 && index < climb.length - 1 ? climb[index + 1] : undefined;

  return (
    <div className="site-wrap flex flex-1 flex-col py-8 sm:py-12">
      <h1 className="text-center font-serif text-4xl tracking-tight">
        {category.name}
      </h1>
      <p className="mt-2 text-center font-sans text-[0.625rem] leading-4">
        products
      </p>

      <ul className="mt-8 border border-ink">
        {[1, 2, 3, 4, 5].map((slot) => (
          <li key={slot} className="border-b border-ink last:border-b-0">
            <Link
              href={`/climb/${category.slug}/beta/${slot}`}
              className="block px-4 py-3 no-underline hover:bg-ink hover:text-paper"
            >
              {slotLabel(category.name, slot)}
            </Link>
          </li>
        ))}
      </ul>

      <nav className="mt-8 flex justify-between gap-4 font-sans text-sm">
        {previous ? (
          <Link href={`/climb/${previous.slug}`}>{previous.name}</Link>
        ) : (
          <span />
        )}
        {next ? <Link href={`/climb/${next.slug}`}>{next.name}</Link> : null}
      </nav>
    </div>
  );
}
