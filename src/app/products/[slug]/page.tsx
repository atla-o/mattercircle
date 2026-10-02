import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct, listClimb } from "@/lib/climb";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return listClimb().flatMap((category) =>
    category.products.map((product) => ({ slug: product.slug })),
  );
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const found = getProduct(slug);
  if (!found) {
    return { title: "Product" };
  }
  return {
    title: found.product.name,
    description: found.product.summary,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const found = getProduct(slug);
  if (!found) {
    notFound();
  }
  const { product, category } = found;

  return (
    <div className="site-wrap flex flex-1 flex-col py-8 sm:py-12">
      <p className="kicker">
        <Link href={`/climb/${category.slug}`}>{category.name}</Link>
        <span className="mx-2" aria-hidden="true">
          ·
        </span>
        {product.status}
      </p>
      <h1 className="mt-3 font-serif text-4xl tracking-tight">{product.name}</h1>
      <p className="mt-4 max-w-prose text-lg">{product.summary}</p>
      <p className="mt-6 max-w-prose text-sm leading-6">
        Physical product. Category name stays {category.name}. Kit contents can
        flex without renaming the lock.
      </p>
    </div>
  );
}
