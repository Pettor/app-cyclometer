# Cyclometer

[![GitHub](https://img.shields.io/badge/license-MIT-green)](https://github.com/Pettor/app-cyclometer/blob/main/LICENSE)
[![Actions Main](../../actions/workflows/main.yml/badge.svg)](../../actions/workflows/main.yml)
[![Coverage](https://img.shields.io/badge/coverage-%E2%89%A580%25-brightgreen)](../../actions/workflows/ci.yml)
[![Storybook](https://raw.githubusercontent.com/storybooks/brand/master/badge/badge-storybook.svg)](https://pettor.github.io/app-cyclometer/storybook/)

**Odd meters, in a loop.** Cyclometer is a practice tool for musicians learning odd time signatures. Build a flow of time signatures (7/16, 5/8, 11/16…), choose how many times each one replays, and practise along with a metronome until the cycle feels natural. When you're ready, turn the flow into a drum part and export it as MIDI.

## 🚀 Demo

- **[Live application](https://pettor.github.io/app-cyclometer/app/)**
- **[Storybook component library](https://pettor.github.io/app-cyclometer/storybook/)**

## ✨ Features

### Flow editor

- **Time signature flow** — stack patterns that play top to bottom and then cycle. Add from presets (5/8, 7/8, 7/16, 9/8, 11/16, 13/16, 4/4, 6/8), reorder, duplicate and delete.
- **Groupings** — choose how each bar is felt (`4+3`, `3+4`, `2+2+3`, …). Every group gets its own color throughout the app.
- **Slots** — tap a slot to cycle it between note, accent (`>`) and rest (`R`).
- **Replays** — each pattern plays a set number of times before the flow moves on.
- **Cycle ring** — the current bar drawn as a clock face: the amber downbeat sits at 12 o'clock, arcs show the groups and the playhead lights up each slot.
- **Metronome** — deep kick on the downbeat, a ping on accents and a light click on everything else. Tempo, loop and mute controls.
- **Cycle timeline** — see how long each pattern lasts within one full cycle, with live progress.

### Drum lab

- **Drum grid** — eight voices (crash, ride, open hat, hi-hat, snare, two toms, kick) with hit, accent and ghost levels, plus per-instrument mute and audition.
- **Groove suggestions** — generate a part from the grouping in six styles: Groove, Prog, Half-time, Linear, Busy and Sparse, with an explanation of why it fits.
- **Fills** — an automatic snare-to-toms fill on the last pass of each pattern, editable separately from the main groove.
- **MIDI export** — download a Standard MIDI File with General MIDI drums on channel 10 and a time signature change at every pattern.

### Everywhere

- Sounds are synthesised with the Web Audio API. No samples, no network calls, no accounts.
- Your flow and preferences are saved in the browser's local storage.
- Responsive: a three-panel desktop layout, and Play / Flow / Edit tabs with a bottom transport bar on phones.
- Light and dark themes, installable as a PWA with offline support, and every string goes through `react-intl` so the app can be translated.

## 🏗️ Tech stack

- **[React 19](https://react.dev/)** + **[TypeScript](https://www.typescriptlang.org/)** + **[Vite](https://vitejs.dev/)**
- **[HeroUI v3](https://www.heroui.com/)** components on **[Tailwind CSS 4](https://tailwindcss.com/)**, icons from **[Heroicons](https://heroicons.com/)**
- **[TanStack Router](https://tanstack.com/router)** (hash routing) and **[Jotai](https://jotai.org/)** for state
- **[Zod](https://zod.dev/)** to validate persisted data
- **[Vitest](https://vitest.dev/)** + **[Storybook](https://storybook.js.org/)** component tests running in Chromium, with accessibility checks
- **[Turborepo](https://turbo.build/repo/)** monorepo managed with **pnpm**

## 🏃 Quick start

### Prerequisites

- Node.js 22 or higher
- pnpm (enabled through corepack)

### Installation

```bash
git clone https://github.com/Pettor/app-cyclometer.git
cd app-cyclometer
corepack enable
pnpm install
pnpm dev
```

The app runs at `https://localhost:5113`. The dev server uses a self-signed certificate, so your browser will show a warning on the first visit.

### Scripts

| Command          | What it does                                          |
| ---------------- | ----------------------------------------------------- |
| `pnpm dev`       | Start the development server                          |
| `pnpm build`     | Build for production                                  |
| `pnpm test`      | Run unit and Storybook component tests (Chromium)     |
| `pnpm lint`      | Run ESLint                                            |
| `pnpm format`    | Format with Prettier                                  |
| `pnpm storybook` | Start Storybook at `localhost:9050`                   |
| `pnpm deploy`    | Build the app and Storybook into `output/deployment/` |

The first time you run tests, download the browser with `pnpm --filter @app/storybook exec playwright install chromium-headless-shell`.

## 🗂️ Project structure

```
├── apps/
│   ├── web/                # The Cyclometer app (React 19 + Vite + HeroUI v3)
│   └── storybook/          # Storybook configuration and test runner
├── packages/
│   ├── ui/                 # (@package/ui) Cross-app UI (logo, layouts, icons)
│   ├── react/              # (@package/react) Reusable React hooks
│   └── storybook/          # (@package/storybook) Storybook decorators
├── configs/                # Shared ESLint, Tailwind, TypeScript and Vite configs
├── design/tokens/          # (@design/tokens) Style Dictionary design tokens
└── docs/                   # Architecture reference
```

Inside `apps/web/src`:

| Folder                           | Contents                                                                 |
| -------------------------------- | ------------------------------------------------------------------------ |
| `core/flow/`                     | Flow model, meter math (groupings, timing) and persisted atoms           |
| `core/transport/`                | Playhead logic and the drift-corrected playback scheduler                |
| `core/audio/`                    | Web Audio synth for metronome clicks and drum voices                     |
| `core/drums/`                    | Drum kit, groove suggestion, drum parts and MIDI export                  |
| `components/`                    | Reusable UI: cycle ring, slot strip, transport controls, stepper, header |
| `views/flow/`, `views/drum-lab/` | Page compositions, split into panels                                     |
| `routes/`                        | `/` (flow editor) and `/drums` (drum lab), each with a route hook        |

`apps/web` follows a four-layer architecture: `core/` → `components/` → `views/` → `routes/`. See [`docs/architecture.md`](./docs/architecture.md), [`docs/structure.md`](./docs/structure.md) and [`docs/patterns.md`](./docs/patterns.md) for details.

## 🤝 Contributing

1. Fork the repository and create a branch: `git checkout -b feature/my-feature`
2. Make your changes, adding stories and tests for new components
3. Run `pnpm lint` and `pnpm test`
4. Open a pull request with a clear description

Commits follow [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `docs:`, …).

## 📄 License

Licensed under the **MIT License**. See [LICENSE](LICENSE).
