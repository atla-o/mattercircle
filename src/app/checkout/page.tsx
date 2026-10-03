"use client";

import { useEffect, useState } from "react";
import { addCheckout, changeQuantity, readCheckout, type CheckoutItem } from "@/lib/checkout";
import { formatUsd, unitAmountCents } from "@/lib/price";
import { slotLabel } from "@/lib/slot";

const fieldClass = "w-full border border-ink bg-paper px-2 py-1 font-sans text-xs";

export default function CheckoutPage() {
  const [items, setItems] = useState<CheckoutItem[]>([]);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get("add");
    const n = params.get("n");
    const categoryName = params.get("name");
    if (slug && n && categoryName) {
      addCheckout({ slug, n, categoryName });
      window.history.replaceState(null, "", "/checkout");
    }
    setItems(readCheckout());
  }, []);

  function adjust(id: string, delta: number) {
    setItems(changeQuantity(id, delta));
  }

  async function pay(form: HTMLFormElement) {
    if (items.length === 0 || paying) {
      return;
    }
    setPaying(true);
    setError("");
    const data = new FormData(form);
    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        items: items.map((item) => ({
          slug: item.slug,
          n: item.n,
          categoryName: item.categoryName,
          quantity: item.quantity,
        })),
        address: {
          name: String(data.get("name") ?? ""),
          line1: String(data.get("line1") ?? ""),
          city: String(data.get("city") ?? ""),
          region: String(data.get("region") ?? ""),
          postal: String(data.get("postal") ?? ""),
        },
      }),
    });
    const payload = (await response.json()) as { url?: string; error?: string };
    if (!response.ok || !payload.url) {
      setError(payload.error || "Checkout did not start");
      setPaying(false);
      return;
    }
    window.location.href = payload.url;
  }

  const total = items.reduce((sum, item) => sum + unitAmountCents * item.quantity, 0);

  return (
    <div className="site-wrap flex flex-1 flex-col py-4">
      <h1 className="text-center font-serif text-2xl tracking-tight">checkout</h1>
      <form
        className="mt-4 grid gap-2"
        autoComplete="on"
        onSubmit={(event) => {
          event.preventDefault();
          void pay(event.currentTarget);
        }}
      >
        <p className="font-sans text-xs">payment</p>
        <button
          type="submit"
          disabled={items.length === 0 || paying}
          className="border border-ink px-3 py-2 font-sans text-sm disabled:opacity-40"
        >
          {paying ? "pay" : `pay ${items.length > 0 ? formatUsd(total) : ""}`.trim()}
        </button>
        {error ? <p className="font-sans text-xs">{error}</p> : null}
        <p className="mt-1 font-sans text-xs">address</p>
        <input className={fieldClass} name="name" autoComplete="name" placeholder="name" aria-label="name" />
        <input className={fieldClass} name="line1" autoComplete="address-line1" placeholder="street" aria-label="street" />
        <div className="grid grid-cols-3 gap-2">
          <input className={fieldClass} name="city" autoComplete="address-level2" placeholder="city" aria-label="city" />
          <input className={fieldClass} name="region" autoComplete="address-level1" placeholder="region" aria-label="region" />
          <input className={fieldClass} name="postal" autoComplete="postal-code" placeholder="postal" aria-label="postal" />
        </div>
      </form>
      {items.length > 0 ? (
        <ul className="mt-4 flex gap-2 overflow-x-auto">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex shrink-0 items-center gap-2 border border-ink px-2 py-1 font-sans text-xs"
            >
              <span>
                {slotLabel(item.categoryName, item.n)} {formatUsd(unitAmountCents)}
              </span>
              <button
                type="button"
                aria-label={`decrease ${slotLabel(item.categoryName, item.n)}`}
                onClick={() => adjust(item.id, -1)}
              >
                −
              </button>
              <span className="tabular-nums">{item.quantity}</span>
              <button
                type="button"
                aria-label={`increase ${slotLabel(item.categoryName, item.n)}`}
                onClick={() => adjust(item.id, 1)}
              >
                +
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
