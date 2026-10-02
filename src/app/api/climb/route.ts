import { climbLabel, listClimb } from "@/lib/climb";
import { site } from "@/lib/site";

export function GET() {
  const climb = listClimb().map((category) => ({
    order: category.order,
    slug: category.slug,
    name: category.name,
    summary: category.summary,
    href: `/climb/${category.slug}`,
    products: category.products.map((product) => ({
      slug: product.slug,
      name: product.name,
      status: product.status,
      href: `/products/${product.slug}`,
    })),
  }));

  return Response.json({
    name: site.name,
    thesis: site.thesis,
    climbName: site.climbName,
    endState: site.endState,
    path: climbLabel(),
    climb,
  });
}
