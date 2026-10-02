import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  CATEGORY_NAMES,
  climbLabel,
  getCategory,
  getProduct,
  listClimb,
  lockedProducts,
  neighbors,
} from "./climb.ts";

describe("climb", () => {
  it("keeps the seven plain category names in order", () => {
    const climb = listClimb();
    assert.deepEqual(
      climb.map((category) => category.name),
      [...CATEGORY_NAMES],
    );
    assert.deepEqual(
      climb.map((category) => category.order),
      [1, 2, 3, 4, 5, 6, 7],
    );
    assert.equal(
      climbLabel(),
      "Toiletries → Wearables → Utility → Furniture → Structure → Altered → Infrastructure",
    );
  });

  it("locks Vessel Kit first, under Toiletries", () => {
    const locked = lockedProducts();
    assert.equal(locked.length, 1);
    assert.equal(locked[0]?.name, "Vessel Kit");
    assert.equal(locked[0]?.slug, "vessel-kit");
    assert.equal(locked[0]?.status, "locked");

    const toiletries = getCategory("toiletries");
    assert.ok(toiletries);
    assert.deepEqual(
      toiletries.products.map((product) => product.slug),
      ["vessel-kit"],
    );

    const found = getProduct("vessel-kit");
    assert.equal(found?.category.slug, "toiletries");
  });

  it("leaves later rungs open for products that can flex", () => {
    for (const slug of [
      "wearables",
      "utility",
      "furniture",
      "structure",
      "altered",
      "infrastructure",
    ]) {
      const category = getCategory(slug);
      assert.ok(category);
      assert.deepEqual(category.products, []);
    }
    assert.equal(
      getCategory("infrastructure")?.summary,
      "House and item decomposer.",
    );
  });

  it("walks neighbors and misses unknown slugs", () => {
    assert.equal(neighbors("toiletries").previous, undefined);
    assert.equal(neighbors("toiletries").next?.slug, "wearables");
    assert.equal(neighbors("infrastructure").next, undefined);
    assert.equal(neighbors("infrastructure").previous?.slug, "altered");
    assert.equal(getCategory("missing"), undefined);
    assert.equal(getProduct("missing"), undefined);
  });
});
