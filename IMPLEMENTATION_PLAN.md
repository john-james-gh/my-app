# WoW Character Readiness Checker Implementation Plan

## Goal

Build a lightweight Next.js app where a player can enter a WoW character by region, realm, and name, then get a clear readiness report in under 10 seconds.

The MVP should answer one question well:

```text
What obvious character setup issues should this player fix right now?
```

## Product Scope

### In Scope

- Character lookup by region, realm, and character name
- Server-side Battle.net API integration
- Readiness score
- Checklist of missing gems, enchants, and tier-set progress
- Plain-language fix explanations
- Clean, modern, responsive UI
- Shareable result URLs

### Out of Scope

- Battle.net login
- Guild management
- Raid calendars
- Full log analysis
- Raidbots-style simulation
- Recruitment tooling
- Advanced stat weight optimization
- Crest recommendations
- General gear upgrade recommendations

## Primary User Flow

1. User opens `/`.
2. User selects region and enters realm plus character name.
3. App navigates to a shareable result route:

   ```text
   /character/[region]/[realm]/[name]
   ```

4. Server fetches character data from Battle.net.
5. App analyzes gear/setup readiness.
6. User sees:
   - Readiness score
   - Character summary
   - Missing setup checklist
   - Simple explanation for each fix

## Recommended App Structure

```text
app/
  page.tsx
  character/
    [region]/
      [realm]/
        [name]/
          page.tsx
          loading.tsx
          error.tsx

components/
  character-search-form.tsx
  character-summary.tsx
  readiness-score.tsx
  issue-list.tsx
  issue-card.tsx

lib/
  battlenet/
    client.ts
    token.ts
    types.ts
  readiness/
    analyze.ts
    rules.ts
    types.ts
  validation.ts
```

## Architecture

Use a server-first Next.js approach.

- Fetch Battle.net data from Server Components or server-only library functions.
- Keep Battle.net credentials out of the browser.
- Use Route Handlers only if an explicit HTTP API boundary becomes useful.
- Keep the readiness analyzer independent from React so it can be unit tested.
- Model expected lookup failures as typed return values, not uncaught exceptions.

Recommended data flow:

```text
lookup input
-> normalize region, realm, and character name
-> fetch Battle.net profile/equipment/media
-> analyze gear and setup
-> produce readiness report
-> render result UI
```

## Core Types

The readiness engine should return a stable report shape that the UI can render without knowing Battle.net details.

```ts
type ReadinessReport = {
  score: number;
  summary: string;
  character: CharacterSummary;
  issues: ReadinessIssue[];
};

type ReadinessIssue = {
  id: string;
  severity: "high" | "medium" | "low";
  category: "enchant" | "gem" | "tier";
  title: string;
  description: string;
  slot?: string;
};
```

## MVP Readiness Rules

Start with obvious, explainable checks:

- Missing enchants on eligible slots
- Empty gem sockets
- Missing or incomplete tier-set count, if detectable

Avoid crest, item-level, crafted gear, and other upgrade recommendations until
the basic gem/enchant/tier audit is reliable.

## Battle.net Integration

Use the OAuth client credentials flow on the server.

Required environment variables:

```text
BATTLE_NET_CLIENT_ID=
BATTLE_NET_CLIENT_SECRET=
```

Initial data needs:

- Character profile
- Character equipment
- Character media, if useful for UI polish

Normalize inputs before requests:

- Region: lowercase, constrained to supported values
- Realm: slug format
- Character name: lowercase for URL, display name from API where possible

## Caching Strategy

Character data does not need to be live to the second.

Recommended MVP cache behavior:

- Cache successful lookups briefly, around 5-15 minutes.
- Avoid aggressive caching for failed lookups.
- Keep token fetching separate from character-data caching.

This keeps the app responsive and reduces Battle.net API pressure.

## Error States

Expected errors should render useful UI:

- Character not found
- Realm not found
- Unsupported region
- Battle.net credentials missing
- Battle.net rate limited
- Battle.net unavailable
- Character data incomplete or private

Use `not-found.tsx` only for true not-found route states. For normal API lookup failures, render explicit expected-error states.

## UI Direction

The first screen should be the actual tool, not a marketing landing page.

The result page should prioritize scanability:

- Large readiness score
- One-sentence summary
- Character identity and basic metadata
- Prioritized checklist
- Clear severity states
- Compact explanations

Avoid spreadsheet-style dense tables for MVP. Use structured cards or rows for individual issues.

## Implementation Phases

### Phase 1: Static Product Shell

- Replace starter page with search UI.
- Add region, realm, and character inputs.
- Add responsive layout and visual direction.
- Add result-page skeleton with mocked report data.

### Phase 2: Battle.net Client

- Add server-only Battle.net token fetcher.
- Add typed client methods for character profile and equipment.
- Add environment validation.
- Add basic expected-error handling.

### Phase 3: Readiness Engine

- Define internal report and issue types.
- Map Battle.net equipment data into normalized gear slots.
- Implement first rules for enchants, gems, and tier count.
- Add unit tests for scoring and issue generation.

### Phase 4: Real Result Route

- Wire `/character/[region]/[realm]/[name]` to real Battle.net data.
- Render loading and error states.
- Add shareable result URLs.
- Add empty and partial-data states.

### Phase 5: Polish and Validation

- Tune scoring weights.
- Improve copy for fix explanations.
- Verify mobile and desktop layouts.
- Run lint/build.
- Add README setup notes for Battle.net credentials.

## Testing Priorities

Focus tests where logic can regress:

- Input normalization
- Battle.net error mapping
- Readiness rule outputs
- Score calculation
- Empty or partial equipment data

UI tests can stay light during MVP unless interactions become more complex.

## Success Criteria

The MVP is ready when:

- A user can check a character in under 10 seconds.
- The result page clearly shows readiness score and fixes.
- Every score deduction maps to a visible issue.
- Battle.net secrets never reach the browser.
- The app handles failed lookups without crashing.
