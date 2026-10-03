export type CheckoutItem = {
  id: string;
  slug: string;
  n: string;
  categoryName: string;
  quantity: number;
};

const key = "mattercircle-checkout";

function readList(): CheckoutItem[] {
  if (typeof window === "undefined") {
    return [];
  }
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw) as CheckoutItem[];
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed
      .filter((item) => item && item.id && item.categoryName)
      .map((item) => ({
        ...item,
        quantity: Number.isFinite(item.quantity) && item.quantity > 0 ? item.quantity : 1,
      }));
  } catch {
    return [];
  }
}

function writeList(items: CheckoutItem[]): void {
  window.localStorage.setItem(key, JSON.stringify(items));
}

export function readCheckout(): CheckoutItem[] {
  return readList();
}

export function addCheckout(item: Omit<CheckoutItem, "id" | "quantity">): void {
  const id = `${item.slug}-${item.n}`;
  const items = readList();
  const existing = items.find((entry) => entry.id === id);
  if (existing) {
    existing.quantity += 1;
  } else {
    items.push({ ...item, id, quantity: 1 });
  }
  writeList(items);
  window.dispatchEvent(new Event("mattercircle-checkout"));
}

export function changeQuantity(id: string, delta: number): CheckoutItem[] {
  const items = readList().flatMap((item) => {
    if (item.id !== id) {
      return [item];
    }
    const quantity = item.quantity + delta;
    return quantity > 0 ? [{ ...item, quantity }] : [];
  });
  writeList(items);
  return items;
}
