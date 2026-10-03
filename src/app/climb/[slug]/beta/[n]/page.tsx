import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductSlides } from "@/components/ProductSlides";
import { PurchaseButton } from "@/components/PurchaseButton";
import { shownClimb } from "@/lib/shown";
import { slotLabel } from "@/lib/slot";

type BetaPageProps = {
  params: Promise<{ slug: string; n: string }>;
};

const slots = ["1", "2", "3", "4", "5"];

export function generateStaticParams() {
  return shownClimb().flatMap((category) =>
    slots.map((n) => ({ slug: category.slug, n })),
  );
}

export async function generateMetadata({
  params,
}: BetaPageProps): Promise<Metadata> {
  const { slug, n } = await params;
  const category = shownClimb().find((item) => item.slug === slug);
  if (!category || !slots.includes(n)) {
    return { title: "Beta" };
  }
  return { title: slotLabel(category.name, n) };
}

export default async function BetaProductPage({ params }: BetaPageProps) {
  const { slug, n } = await params;
  const category = shownClimb().find((item) => item.slug === slug);
  if (!category || !slots.includes(n)) {
    notFound();
  }

  const label = slotLabel(category.name, n);

  return (
    <div className="site-wrap flex min-h-0 w-full flex-1 flex-col py-8">
      <h1 className="text-center font-serif text-4xl tracking-tight">{label}</h1>
      <p className="mt-1 text-center font-sans text-sm">
        <Link href={`/climb/${category.slug}`}>{category.name}</Link>
      </p>
      <ProductSlides />
      <PurchaseButton
        slug={category.slug}
        n={n}
        categoryName={category.name}
      />
    </div>
  );
}
