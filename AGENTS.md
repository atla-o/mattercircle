# Mattercircle — agent notes

## Standing objective (Devo UI-first)

Cursor cloud work for this product: one promptable environment, kept current.

You handle code. Devo handles the human UI himself and reiterates it. Do not restyle. He will fix the look.

Priority order for every task unless Devo says otherwise:

1. **Complete functional UI** — usable end-to-end. The hub reads the climb functions. No blocking coming-soon for the climb itself.
2. Black text on **white** backgrounds always. Never follow system dark mode. Never white-on-black.
3. Publish code through GitHub to `main`. `main` is what serves the existing public host. No throwaway host. No new pull request unless a real code change needs one.

Publisher: **atla-o**. Parent: Devo Holdings. Public GitHub: [github.com/atla-o/mattercircle](https://github.com/atla-o/mattercircle).

Investor tops: Arcada · Lightround · Humanehealth · Mattercircle.

Public host: [https://mattercircle.devoutshaman.com](https://mattercircle.devoutshaman.com). Cloud Run service `mattercircle-web` in project `devo-holding`, region `us-west1`. DNS is already a CNAME to `ghs.googlehosted.com`. Do not change Cloudflare. Do not add DNS.

## Live UI preview

Any UI change that is not yet what Devo should look at needs a clickable live preview he can open. Screenshots alone are not enough.

- Before it is on the public host, give a Cursor preview link.
- Once the public host is the thing to look at, give [https://mattercircle.devoutshaman.com](https://mattercircle.devoutshaman.com).

No throwaway host.

## This product

Mattercircle is the matter and factory hub under Devo Holdings. It is the physics and materials investor peer.

Thesis: anti-petroleum homestead essentials. The HIGH PURITY climb, in this order:

Toiletries → Wearables → Utility → Furniture → Structure → Altered → Infrastructure

Category names stay plain. Do not rename them. Do not invent trade names for the rungs. Products inside a category can flex later.

The spine is that climb. Do not replace it with a single product. Vessel Kit is only the current Toiletries product, not the spine. Products inside a rung can flex. The factory end-state is physical products. Infrastructure is the house and item decomposer.

Catalog functions live in `src/lib/climb.ts`. HTTP reads are `GET /api/climb`, `GET /api/climb/[slug]`, and `GET /api/products/[slug]`. Pages call the same functions.

## Stack

Next.js App Router, TypeScript, Tailwind v4. Dev server: `npm run dev`.

Read Next.js notes in `node_modules/next/dist/docs/` before inventing APIs from older training data. `next.config.ts` sets `agentRules: false` so `next dev` does not rewrite this file.

## Cursor Cloud specific instructions

A later cloud agent clones [atla-o/mattercircle](https://github.com/atla-o/mattercircle) and starts from this file. Do not invent another product or another workflow.

- Install: `npm ci`
- Dev server: `npm run dev -- --hostname 0.0.0.0 --port 3000` → http://127.0.0.1:3000
- Checks: `npm test`, then `npm run typecheck`, then `npm run lint`
- Boot config for a fresh agent: `.cursor/environment.json` (`npm ci`, then that dev server)
- The preview rule also lives in `.cursor/rules/live-ui-preview.mdc` and applies on every turn

Any UI change that is not yet what Devo should look at still needs a clickable live preview in the reply: a Cursor preview link before it is on the public host, and [https://mattercircle.devoutshaman.com](https://mattercircle.devoutshaman.com) once that is the page to look at. Screenshots alone do not count. No throwaway host.

Code on `main` is what the public host serves. Do not change Cloudflare. Do not add DNS. Do not open a new Cloudflare account.
