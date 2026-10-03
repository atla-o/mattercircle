import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

export type OrderStatus = "pending" | "paid" | "failed" | "refunded";

export type OrderLine = {
  slug: string;
  n: string;
  categoryName: string;
  name: string;
  quantity: number;
  unitAmount: number;
};

export type Order = {
  id: string;
  status: OrderStatus;
  currency: "usd";
  amount: number;
  lines: OrderLine[];
  cancelPath: string;
  sessionId?: string;
  paymentIntentId?: string;
};

const file = path.join(process.cwd(), "data", "orders.json");

function readAll(): Record<string, Order> {
  try {
    const parsed = JSON.parse(readFileSync(file, "utf8")) as Record<string, Order>;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function writeAll(orders: Record<string, Order>): void {
  mkdirSync(path.dirname(file), { recursive: true });
  writeFileSync(file, JSON.stringify(orders));
}

export function packLines(lines: OrderLine[]): Record<string, string> {
  const meta: Record<string, string> = {};
  let bucket = "";
  let index = 0;
  for (const line of lines) {
    const part = `${line.name}:${line.quantity}`;
    const next = bucket ? `${bucket},${part}` : part;
    if (bucket && next.length > 450) {
      meta[`lines${index}`] = bucket;
      index += 1;
      bucket = part;
    } else {
      bucket = next;
    }
  }
  if (bucket) {
    meta[`lines${index}`] = bucket;
  }
  return meta;
}

export function unpackLines(metadata: Record<string, string> | null | undefined): OrderLine[] {
  const keys = Object.keys(metadata ?? {})
    .filter((key) => /^lines\d+$/.test(key))
    .sort((a, b) => Number(a.slice(5)) - Number(b.slice(5)));
  const raw = keys.map((key) => metadata?.[key] ?? "").join(",");
  return raw
    .split(",")
    .filter(Boolean)
    .flatMap((part) => {
      const split = part.lastIndexOf(":");
      if (split <= 0) {
        return [];
      }
      const quantity = Number(part.slice(split + 1));
      if (!Number.isInteger(quantity) || quantity < 1) {
        return [];
      }
      return [
        {
          slug: "",
          n: "",
          categoryName: "",
          name: part.slice(0, split),
          quantity,
          unitAmount: 0,
        },
      ];
    });
}

export function saveOrder(order: Order): Order {
  try {
    const orders = readAll();
    orders[order.id] = order;
    writeAll(orders);
  } catch {
    return order;
  }
  return order;
}

export function getOrder(id: string): Order | undefined {
  return readAll()[id];
}

export function findOrderByPaymentIntent(paymentIntentId: string): Order | undefined {
  return Object.values(readAll()).find((order) => order.paymentIntentId === paymentIntentId);
}

export function applyStatus(current: OrderStatus, incoming: OrderStatus): OrderStatus {
  if (incoming === "refunded") {
    return "refunded";
  }
  if (current === "refunded") {
    return "refunded";
  }
  if (incoming === "failed" && current === "paid") {
    return "paid";
  }
  if (incoming === "paid" || incoming === "failed") {
    return incoming;
  }
  return current;
}

export function markOrder(
  id: string,
  status: OrderStatus,
  extra?: { sessionId?: string; paymentIntentId?: string },
): Order | undefined {
  const orders = readAll();
  const order = orders[id];
  if (!order) {
    return undefined;
  }
  order.status = applyStatus(order.status, status);
  if (extra?.sessionId) {
    order.sessionId = extra.sessionId;
  }
  if (extra?.paymentIntentId) {
    order.paymentIntentId = extra.paymentIntentId;
  }
  orders[id] = order;
  try {
    writeAll(orders);
  } catch {
    return order;
  }
  return order;
}
