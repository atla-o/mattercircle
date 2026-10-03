import { findOrderByPaymentIntent, getOrder, markOrder, type OrderStatus } from "@/lib/orders";
import { getStripe } from "@/lib/stripe";
import type Stripe from "stripe";

export const dynamic = "force-dynamic";

function paymentIntentId(value: string | Stripe.PaymentIntent | null | undefined): string | undefined {
  if (!value) {
    return undefined;
  }
  return typeof value === "string" ? value : value.id;
}

export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = request.headers.get("stripe-signature");
  if (!secret || !signature) {
    return new Response("Webhook is not configured", { status: 400 });
  }

  const payload = await request.text();
  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(payload, signature, secret);
  } catch {
    return new Response("Invalid signature", { status: 400 });
  }

  if (event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId || session.client_reference_id || "";
    const status: OrderStatus = session.payment_status === "paid" ? "paid" : "pending";
    if (orderId && status === "paid") {
      markOrder(orderId, "paid", {
        sessionId: session.id,
        paymentIntentId: paymentIntentId(session.payment_intent),
      });
    }
  }

  if (event.type === "checkout.session.async_payment_failed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId || session.client_reference_id || "";
    if (orderId) {
      markOrder(orderId, "failed", { sessionId: session.id });
    }
  }

  if (event.type === "payment_intent.payment_failed") {
    const intent = event.data.object as Stripe.PaymentIntent;
    const orderId = intent.metadata?.orderId;
    const order = orderId ? getOrder(orderId) : findOrderByPaymentIntent(intent.id);
    if (order) {
      markOrder(order.id, "failed", { paymentIntentId: intent.id });
    }
  }

  if (event.type === "charge.refunded") {
    const charge = event.data.object as Stripe.Charge;
    const intentId = paymentIntentId(charge.payment_intent);
    const order = intentId ? findOrderByPaymentIntent(intentId) : undefined;
    if (order && charge.amount_refunded > 0) {
      markOrder(order.id, "refunded", { paymentIntentId: intentId });
    }
  }

  return new Response("ok");
}
