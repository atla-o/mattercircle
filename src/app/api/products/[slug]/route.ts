import { getProduct } from "@/lib/climb";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { slug } = await context.params;
  const found = getProduct(slug);
  if (!found) {
    return Response.json({ error: "Unknown product." }, { status: 404 });
  }

  return Response.json({
    ...found.product,
    href: `/products/${found.product.slug}`,
    category: {
      slug: found.category.slug,
      name: found.category.name,
      href: `/climb/${found.category.slug}`,
    },
  });
}
