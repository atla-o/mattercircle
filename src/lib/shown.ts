import { listClimb, type Category } from "@/lib/climb";

const hidden = new Set(["structure", "altered", "infrastructure"]);

export function shownClimb(): Category[] {
  return listClimb().filter((category) => !hidden.has(category.slug));
}
