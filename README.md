# Readycheck

A lightweight WoW character readiness checker built with Next.js.

## Setup

Install dependencies:

```bash
pnpm install
```

Create a local env file:

```bash
cp .env.example .env.local
```

Add Battle.net API credentials:

```text
BATTLE_NET_CLIENT_ID=
BATTLE_NET_CLIENT_SECRET=
```

Run the app:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Battle.net Client

The Battle.net integration scaffold lives in `lib/battlenet`.

- `config.ts`: server-only env and regional API config
- `token.ts`: OAuth client credentials token fetcher
- `client.ts`: profile/equipment API methods
- `types.ts`: typed DTOs and expected-error results

The readiness normalization boundary lives in `lib/readiness/equipment.ts`.
It maps raw Battle.net equipment payloads into the stable internal shape the
readiness rules will use.

The UI still renders mock readiness data. The next step is to implement the
real gem, enchant, and tier-set readiness rules against normalized equipment.
