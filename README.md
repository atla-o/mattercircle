# Mattercircle

Mattercircle is the matter and factory hub under Devo Holdings.

Thesis: anti-petroleum homestead essentials. The HIGH PURITY climb:

Toiletries → Wearables → Utility → Furniture → Structure → Altered → Infrastructure

Category names stay plain. Vessel Kit is the first lock, under Toiletries. Infrastructure is the house and item decomposer. The factory end-state is physical products.

Publisher: atla-o.

## Run locally

Node 20 or later.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Pages

- `/` — climb
- `/climb/toiletries` through `/climb/infrastructure`
- `/products/vessel-kit` — first lock

## API

- `GET /api/climb`
- `GET /api/climb/[slug]`
- `GET /api/products/[slug]`

## Checks

```bash
npm test
npm run typecheck
npm run build
```
