## PRD: WoW Character Readiness Checker

### Problem

WoW players often miss obvious character setup issues like missing enchants, gems, or tier pieces. Existing tools are either too spreadsheet-heavy, guild-focused, or overly advanced.

### Goal

Create a clean, simple website where any player can paste a character name or log in with Battle.net and instantly see what their character is missing for the current season.

### Target users

Individual WoW players who want a quick gear/setup audit before doing Mythic+, raid, or PvP.

### Core experience

User enters a character, and the site returns a clear readiness summary:

```text
Your character is 84% ready.
Missing: 2 enchants, 1 gem, 1 tier-set milestone.
```

### MVP features

- Character lookup by region, realm, and name
- Battle.net login later, not required for MVP
- Readiness score
- Checklist of missing gems, enchants, and tier-set progress
- Simple explanations for what to fix
- Clean, modern UI instead of a spreadsheet

### Out of scope

- Guild management
- Raid calendars
- Full log analysis
- Raidbots replacement
- Complex simulations
- Crest recommendations
- General gear upgrade recommendations
- Recruitment tools

### Success criteria

The product succeeds if a player can check their character in under 10 seconds and immediately understand what they need to fix.

### Positioning

A lightweight personal WoW setup checker:

> Paste your character. Fix your gear. Stop being scuffed.
