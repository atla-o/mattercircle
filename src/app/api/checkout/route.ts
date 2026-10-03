import { randomBytes } from "node:crypto";
import { shownClimb } from "@/lib/shown";
import { slotLabel } from "@/lib/slot";
import { formatUsd, unitAmountCents } from "@/lib/price";
import { packLines, saveOrder, type OrderLine } from "@/lib/orders";
import { getStripe, integrationIdentifier } from "@/lib/stripe";

export const dynamic = "force-dynamic";

type IncomingItem = {
  slug?: string;
  n?: string;
  categoryName?: string;
  quantity?: number;
};

type IncomingAddress = {
  name?: string;
  line1?: string;
  city?: string;
  region?: string;
  postal?: string;
};

const slots = new Set(["1", "2", "3", "4", "5"]);

function originFrom(request: Request): string {
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  const proto = request.headers.get("x-forwarded-proto") ?? "http";
  return `${proto}://${host}`;
}

export async function POST(request: Request) {
  let body: { items?: IncomingItem[]; address?: IncomingAddress };
  try {
    body = (await request.json()) as { items?: IncomingItem[]; address?: IncomingAddress };
  } catch {
    return Response.json({ error: "Invalid checkout" }, { status: 400 });
  }

  const climb = shownClimb();
  const lines: OrderLine[] = [];
  for (const item of body.items ?? []) {
    const slug = item.slug ?? "";
    const n = String(item.n ?? "");
    const category = climb.find((entry) => entry.slug === slug);
    const quantity = item.quantity;
    if (!category || category.name !== item.categoryName || !slots.has(n)) {
      return Response.json({ error: "Unknown product" }, { status: 400 });
    }
    if (!Number.isInteger(quantity) || quantity === undefined || quantity < 1 || quantity > 99) {
      return Response.json({ error: "Invalid quantity" }, { status: 400 });
    }
    lines.push({
      slug,
      n,
      categoryName: category.name,
      name: slotLabel(category.name, n),
      quantity,
      unitAmount: unitAmountCents,
    });
  }
  if (lines.length === 0) {
    return Response.json({ error: "Nothing to pay" }, { status: 400 });
  }

  const amount = lines.reduce((sum, line) => sum + line.unitAmount * line.quantity, 0);
  const orderId = `mc_${randomBytes(8).toString("hex")}`;
  const cancelPath = `/climb/${lines[0].slug}/beta/${lines[0].n}`;
  const origin = originFrom(request);
  const address = body.address;
  const shipping =
    address?.name && address.line1 && address.city && address.region && address.postal
      ? {
          name: address.name,
          address: {
            line1: address.line1,
            city: address.city,
            state: address.region,
            postal_code: address.postal,
            country: "US",
          },
        }
      : undefined;

  saveOrder({
    id: orderId,
    status: "pending",
    currency: "usd",
    amount,
    lines,
    cancelPath,
  });

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      client_reference_id: orderId,
      integration_identifier: integrationIdentifier(),
      success_url: `${origin}/paid/${orderId}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}${cancelPath}`,
      metadata: { orderId, ...packLines(lines) },
      payment_intent_data: {
        metadata: { orderId },
        ...(shipping ? { shipping } : {}),
      },
      line_items: lines.map((line) => ({
        quantity: line.quantity,
        price_data: {
          currency: "usd",
          unit_amount: line.unitAmount,
          product_data: {
            name: line.name,
            description: formatUsd(line.unitAmount),
          },
        },
      })),
    });
    if (!session.url) {
      return Response.json({ error: "Checkout did not start" }, { status: 502 });
    }
    saveOrder({
      id: orderId,
      status: "pending",
      currency: "usd",
      amount,
      lines,
      cancelPath,
      sessionId: session.id,
    });
    return Response.json({ url: session.url, orderId });
  } catch {
    return Response.json({ error: "Checkout did not start" }, { status: 502 });
  }
}
