import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getOrder, markOrder, unpackLines, type Order, type OrderStatus } from "@/lib/orders";
import { formatUsd, unitAmountCents } from "@/lib/price";
import { getStripe } from "@/lib/stripe";
import type Stripe from "stripe";

type PaidPageProps = {
  params: Promise<{ orderId: string }>;
  searchParams: Promise<{ session_id?: string }>;
};

export const metadata: Metadata = {
  title: "Paid",
};

export const dynamic = "force-dynamic";

function stripeStatus(session: Stripe.Checkout.Session): OrderStatus {
  const intent = session.payment_intent;
  const charge =
    intent && typeof intent !== "string" && intent.latest_charge && typeof intent.latest_charge !== "string"
      ? intent.latest_charge
      : undefined;
  if (charge && charge.amount_refunded > 0) {
    return "refunded";
  }
  if (session.payment_status === "paid") {
    return "paid";
  }
  if ((intent && typeof intent !== "string" && intent.status === "canceled") || session.status === "expired") {
    return "failed";
  }
  return "pending";
}

function orderFromSession(orderId: string, session: Stripe.Checkout.Session): Order | undefined {
  const claimed = session.metadata?.orderId || session.client_reference_id;
  if (claimed !== orderId) {
    return undefined;
  }
  const lines = unpackLines(session.metadata).map((line) => ({
    ...line,
    unitAmount: unitAmountCents,
  }));
  if (lines.length === 0) {
    return undefined;
  }
  const amount = lines.reduce((sum, line) => sum + line.unitAmount * line.quantity, 0);
  const intent = session.payment_intent;
  return {
    id: orderId,
    status: stripeStatus(session),
    currency: "usd",
    amount,
    lines,
    cancelPath: "",
    sessionId: session.id,
    paymentIntentId: typeof intent === "string" ? intent : intent?.id,
  };
}

export default async function PaidPage({ params, searchParams }: PaidPageProps) {
  const { orderId } = await params;
  const { session_id: sessionId } = await searchParams;
  let order = getOrder(orderId);

  if (sessionId && (!order || order.sessionId === sessionId || !order.sessionId)) {
    try {
      const session = await getStripe().checkout.sessions.retrieve(sessionId, {
        expand: ["payment_intent.latest_charge"],
      });
      const fromStripe = orderFromSession(orderId, session);
      if (fromStripe) {
        order = markOrder(orderId, fromStripe.status, {
          sessionId: fromStripe.sessionId,
          paymentIntentId: fromStripe.paymentIntentId,
        }) ?? fromStripe;
        if (order.lines.length === 0) {
          order = fromStripe;
        } else {
          order = { ...order, status: fromStripe.status, amount: fromStripe.amount || order.amount };
        }
      }
    } catch {
      order = getOrder(orderId) ?? order;
    }
  }

  if (!order) {
    notFound();
  }

  return (
    <div className="site-wrap flex flex-1 flex-col py-8">
      <h1 className="text-center font-serif text-4xl tracking-tight">paid</h1>
      <p className="mt-4 text-center font-sans text-sm">{order.id}</p>
      <p className="mt-2 text-center font-sans text-sm">{order.status}</p>
      <p className="mt-2 text-center font-sans text-sm">{formatUsd(order.amount)}</p>
      <ul className="mt-6 flex flex-wrap justify-center gap-2">
        {order.lines.map((line, index) => (
          <li key={`${line.name}-${index}`} className="border border-ink px-2 py-1 font-sans text-xs">
            {line.name} × {line.quantity}
          </li>
        ))}
      </ul>
    </div>
  );
}
