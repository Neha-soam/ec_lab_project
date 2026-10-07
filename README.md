# OhmLab

Interactive virtual electrical laboratory for EC/EE students. Built phase by phase per `CLAUDE.md`.

Requires Node 18 or newer. Keep the project outside OneDrive-synced folders (for example `C:\dev\ohmlab`): OneDrive can lock files inside `node_modules` and break `npm install`.

```
npm install
npm run dev        # start dev server
npm run typecheck
npm test
npm run build
```

Current status: **Phase 3 (Resistor and circuit tools)** complete: Calculator and Tools pages.

Engine code lives in `src/engine/` (no React). UI in `src/features/calculator/` and `src/features/tools/` only calls the engine.
