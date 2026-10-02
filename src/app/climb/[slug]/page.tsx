import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategory, listClimb, neighbors } from "@/lib/climb";

type ClimbPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return listClimb().map((category) => ({ slug: category.slug }));
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
  const category = getCategory(slug);
  if (!category) {
    notFound();
  }
  const { previous, next } = neighbors(slug);

  return (
    <div className="site-wrap flex flex-1 flex-col py-8 sm:py-12">
      <p className="kicker">
        <Link href="/">Climb</Link>
        <span className="mx-2" aria-hidden="true">
          ·
        </span>
        {String(category.order).padStart(2, "0")}
      </p>
      <h1 className="mt-3 font-serif text-4xl tracking-tight">{category.name}</h1>
      <p className="mt-4 max-w-prose text-lg">{category.summary}</p>

      <section className="mt-8">
        <h2 className="kicker">Products</h2>
        {category.products.length === 0 ? (
          <p className="mt-3 border border-ink px-4 py-6">
            No product locked in this category yet.
          </p>
        ) : (
          <ul className="mt-3 border border-ink">
            {category.products.map((product) => (
              <li
                key={product.slug}
                className="border-b border-ink last:border-b-0"
              >
                <Link
                  href={`/products/${product.slug}`}
                  className="flex items-baseline justify-between gap-4 px-4 py-3 no-underline hover:bg-ink hover:text-paper"
                >
                  <span>{product.name}</span>
                  <span className="font-sans text-xs">{product.status}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

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
