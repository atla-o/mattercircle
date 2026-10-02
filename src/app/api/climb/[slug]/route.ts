import { getCategory } from "@/lib/climb";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { slug } = await context.params;
  const category = getCategory(slug);
  if (!category) {
    return Response.json({ error: "Unknown category." }, { status: 404 });
  }

  return Response.json({
    ...category,
    href: `/climb/${category.slug}`,
    products: category.products.map((product) => ({
      ...product,
      href: `/products/${product.slug}`,
    })),
  });
}
