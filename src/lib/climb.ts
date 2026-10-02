export const CATEGORY_NAMES = [
  "Toiletries",
  "Wearables",
  "Utility",
  "Furniture",
  "Structure",
  "Altered",
  "Infrastructure",
] as const;

export type CategoryName = (typeof CATEGORY_NAMES)[number];
export type ProductStatus = "locked" | "open";

export type Product = {
  slug: string;
  name: string;
  status: ProductStatus;
  categorySlug: string;
  summary: string;
};

export type Category = {
  order: number;
  slug: string;
  name: CategoryName;
  summary: string;
  products: Product[];
};

const vesselKit: Product = {
  slug: "vessel-kit",
  name: "Vessel Kit",
  status: "locked",
  categorySlug: "toiletries",
  summary:
    "First product lock. A physical vessel kit for wash and keeping. The name stays Vessel Kit. What the kit contains can flex later.",
};

const categories: Category[] = [
  {
    order: 1,
    slug: "toiletries",
    name: "Toiletries",
    summary: "Body-contact wash and keeping.",
    products: [vesselKit],
  },
  {
    order: 2,
    slug: "wearables",
    name: "Wearables",
    summary: "What is worn.",
    products: [],
  },
  {
    order: 3,
    slug: "utility",
    name: "Utility",
    summary: "Daily tools of the homestead.",
    products: [],
  },
  {
    order: 4,
    slug: "furniture",
    name: "Furniture",
    summary: "Pieces that hold a room.",
    products: [],
  },
  {
    order: 5,
    slug: "structure",
    name: "Structure",
    summary: "The built shell.",
    products: [],
  },
  {
    order: 6,
    slug: "altered",
    name: "Altered",
    summary: "Stock changed toward a finished good.",
    products: [],
  },
  {
    order: 7,
    slug: "infrastructure",
    name: "Infrastructure",
    summary: "House and item decomposer.",
    products: [],
  },
];

export function listClimb(): Category[] {
  return categories.map((category) => ({
    ...category,
    products: category.products.map((product) => ({ ...product })),
  }));
}

export function climbLabel(): string {
  return CATEGORY_NAMES.join(" → ");
}

export function getCategory(slug: string): Category | undefined {
  return listClimb().find((category) => category.slug === slug);
}

export function getProduct(
  slug: string,
): { product: Product; category: Category } | undefined {
  for (const category of listClimb()) {
    const product = category.products.find((item) => item.slug === slug);
    if (product) {
      return { product, category };
    }
  }
  return undefined;
}

export function neighbors(slug: string): {
  previous?: Category;
  next?: Category;
} {
  const climb = listClimb();
  const index = climb.findIndex((category) => category.slug === slug);
  if (index < 0) {
    return {};
  }
  return {
    previous: index > 0 ? climb[index - 1] : undefined,
    next: index < climb.length - 1 ? climb[index + 1] : undefined,
  };
}

export function lockedProducts(): Product[] {
  return listClimb().flatMap((category) =>
    category.products.filter((product) => product.status === "locked"),
  );
}
