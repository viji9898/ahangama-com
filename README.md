# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs["recommended-typescript"],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

# Ahangama.com v2 — Data Architecture (Read-Only)

## Overview

Ahangama.com v2 is a **read-only frontend** that consumes venue data from:

- **Neon Postgres**
- Via **Netlify Function: `get-venues`**
- Using environment variable: `DATABASE_URL`

There are **no CRUD endpoints** in v2.

---

# API: `get-venues`

## Endpoint

/.netlify/functions/get-venues

## Method

GET

## Query Parameters

| Parameter         | Type    | Default      | Description                                                       |
| ----------------- | ------- | ------------ | ----------------------------------------------------------------- |
| `destinationSlug` | string  | `"ahangama"` | Filters by destination                                            |
| `category`        | string  | null         | Filters by category (must exist in `categories[]`)                |
| `liveOnly`        | boolean | true         | If not explicitly `"false"`, only `live = true` rows are returned |

---

## Visibility Logic

```sql
destination_slug = ${destinationSlug}
AND (${liveOnly} = false OR live = true)

If liveOnly is not passed → defaults to true.

So public site automatically hides non-live venues.

Database: venues
Identity & Routing
Field	Type	Required
id	TEXT (PK)	✅
destination_slug	TEXT	✅
name	TEXT	✅
slug	TEXT	✅
status	TEXT	✅
live	BOOLEAN	✅
Unique Constraint
UNIQUE(destination_slug, slug)
Canonical Route Design
/:slug
Classification
Field	Type
categories	TEXT[]
emoji	TEXT[]
area	TEXT

Category filtering uses:

${category} = ANY(categories)

This means:

A venue can belong to multiple categories

Category filtering checks array membership

Content Fields
Field	Type
excerpt	TEXT
description	TEXT
best_for	TEXT[]
tags	TEXT[]

Editorial tone:

Curated

Neutral

Informative

Not marketing-heavy

Social Proof & Commercial Fields
Field	Type
stars	NUMERIC
reviews	INT
discount	NUMERIC
card_perk	TEXT
offers	JSONB
how_to_claim	TEXT
restrictions	TEXT
offers JSON Structure Example
[
  {
    "type": "percent",
    "label": "10% Off",
    "discount": 0.1,
    "appliesTo": "total bill"
  }
]
Location & Map
Field	Type
lat	DOUBLE PRECISION
lng	DOUBLE PRECISION
map_url	TEXT

Returned frontend shape:

position: { lat, lng }

If lat/lng are null → position = null

Media
Field	Type
logo	TEXT
image	TEXT
og_image	TEXT
Social & Contact
Field	Type
instagram_url	TEXT
whatsapp	TEXT
Timestamps
Field	Type
created_at	TIMESTAMPTZ
updated_at	TIMESTAMPTZ

updated_at auto-updates via trigger.

Frontend Normalized Object Shape
type Venue = {
  id: string;
  destinationSlug: string;
  name: string;
  slug: string;
  status: string;
  live: boolean;

  categories: string[];
  emoji: string[];
  stars?: number;
  reviews?: number;
  discount?: number;

  excerpt?: string;
  description?: string;
  bestFor: string[];
  tags: string[];

  cardPerk?: string;
  offers: any[];
  howToClaim?: string;
  restrictions?: string;

  area?: string;

  position?: { lat: number; lng: number } | null;
  lat?: number;
  lng?: number;

  logo?: string;
  image?: string;
  ogImage?: string;

  mapUrl?: string;
  instagramUrl?: string;
  whatsapp?: string;

  updatedAt?: string;
  createdAt?: string;
};
Current Dataset Characteristics

Destination: currently "ahangama"

Categories include:

eat

stays

experiences

Most venues include:

Map link

Image

Card perk

Rating + review count

Some logical duplicates exist (same brand across multiple categories)

Ratings range approx: 4.3 – 5.0

Reviews range approx: 10 – 1100+

AI Behavior Rules

When generating UI, logic, or content:

Data is read-only.

No mutation logic should be created.

Category filtering must rely on categories[].

Map rendering depends on position.

Pass badge should show if:

offers.length > 0

OR cardPerk exists.

Slug uniqueness must respect:

(destination_slug, slug)
Environment Requirements

Netlify environment variable:

DATABASE_URL=postgresql://...

If missing → function returns 500 with error.


---

No factual or logical errors detected.
```
