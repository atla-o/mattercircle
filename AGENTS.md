# Mattercircle — agent notes

## Standing objective (Devo UI-first)

Cursor cloud work for this product: one promptable environment, kept current.

Priority order for every task unless Devo says otherwise:

1. **Complete functional UI** — usable end-to-end. The hub reads the climb functions. No blocking coming-soon for the climb itself.
2. Black text on **white** backgrounds always. Never follow system dark mode. Never white-on-black.
3. **Do not merge. Do not deploy.** Wait until Devo says merge and deploy.

Publisher: **atla-o**. Parent: Devo Holdings. Public GitHub: [github.com/atla-o/mattercircle](https://github.com/atla-o/mattercircle).

Investor tops: Arcada · Lightround · Humanehealth · Mattercircle.

## Live UI preview

Every UI change needs a live clickable preview URL, including UI that is not pushed yet. Screenshots are not a substitute.

Stand up a running Next server of the working tree and put the exact URL at the top of the PR description. A preview tunnel or other ephemeral public URL is the path. Do not ask for review or merge until that link loads the hub.

No merge and no production deploy until Devo says merge and deploy. No auto-merge.

## This product

Mattercircle is the matter and factory hub under Devo Holdings. It is the physics and materials investor peer.

Thesis: anti-petroleum homestead essentials. The HIGH PURITY climb, in this order:

Toiletries → Wearables → Utility → Furniture → Structure → Altered → Infrastructure

Category names stay plain. Do not rename them. Do not invent trade names for the rungs. Products inside a category can flex later.

Vessel Kit is the first lock, under Toiletries. The factory end-state is physical products. Infrastructure is the house and item decomposer.

Catalog functions live in `src/lib/climb.ts`. HTTP reads are `GET /api/climb`, `GET /api/climb/[slug]`, and `GET /api/products/[slug]`. Pages call the same functions.

## Stack

Next.js App Router, TypeScript, Tailwind v4. Dev server: `npm run dev`.

Read Next.js notes in `node_modules/next/dist/docs/` before inventing APIs from older training data. `next.config.ts` sets `agentRules: false` so `next dev` does not rewrite this file.
