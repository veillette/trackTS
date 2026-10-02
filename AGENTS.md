# AGENTS.md

Guidance for AI coding agents working in the trackTS codebase.

## Project Overview

trackTS is a web-based video analysis app: users load or record a video, then extract position data from moving objects for motion analysis. Features include webcam recording, video import, multi-track point plotting, OpenCV-based auto-tracking, scale/axes configuration, data export, and Google Drive save/load.

## Commands

```bash
npm install             # Install dependencies
npm run dev             # Vite build in watch mode
npm run build           # Production build -> dist/
npm run start           # Build, then serve on http://localhost:3000
npm run serve           # Serve only (port 3000)
npx tsc --noEmit        # Type-check (Vite does not type-check)
npm run lint            # Biome lint + format check
npm run lint:fix        # Auto-fix lint and format issues
npm run generate-icons  # Regenerate app icons from icons/app_icons/app_icon.svg
```

Before committing, run `npm run lint:fix`, `npx tsc --noEmit`, and `npm run build`.

Webcam and Google Drive features require serving over HTTP (`npm run start`), not opening `index.html` directly.

## Rules

1. **Import order matters**: `ts/main.ts` imports modules in initialization order; reordering can break startup.
2. **Generated output**: never edit `dist/` (built by Vite).
3. **Vendored libraries**: never modify files in `src/`.
4. **Path alias**: `@/*` maps to `ts/*`.
5. **Icons**: edit `icons/app_icons/app_icon.svg`, then run `npm run generate-icons`.

## Architecture

### Tech Stack

- **TypeScript 7** (strict) bundled by **Vite 8** (`vite.config.mts`, Rolldown)
- **CreateJS (EaselJS)** for canvas rendering — vendored in `src/createjs.min.js`, loaded by a `<script>` tag in `index.html`, typed in `ts/externals.d.ts`
- **OpenCV.js** for auto-tracking — vendored in `src/opencv.js`, lazy-loaded by `ts/opencv-loader.ts`
- **Handsontable** for data tables
- **SheetJS (`xlsx`)** for spreadsheet export; **JSZip** for `.trackts` files
- **`ts/units.ts`** for unit conversion
- **Biome** for linting/formatting (`biome.json`); **sharp** for icon generation

### Build

Vite builds two entries from `vite.config.mts`: `ts/main.ts` → `dist/bundle.iife.js` and `ts/help.ts` → `dist/help.iife.js` (despite the name, both are ES modules). The config defines `global` as `globalThis` because dragula's dependencies reference Node's `global`.

### Directory Structure

- `ts/` — TypeScript source
  - `main.ts` — entry point (import order = init order)
  - `globals.ts` — shared state: the `master` Project, Stage, DOM refs, Google API constants
  - `index.ts` — main render loop and canvas drawing
  - `classes/` — `Project`, `Track`, `Timeline`, `Point`, `Frame`, `Scale`, `Axes`, `Table`, `Modal`, `EventEmitter`, serializer, coordinate mapper
  - `opencv-loader.ts`, `opencv-tracking.ts`, `autotrack-ui.ts` — auto-tracking
  - `googleAuth.ts`, `drive.ts`, `saveDrive.ts` — Google Drive (gapi + Identity Services)
  - `webcam.ts`, `webcamevents.ts` — webcam recording
  - `help.ts` — renders `instructions.md` into `help.html`
  - `externals.d.ts`, `types/` — declarations for untyped globals/packages
- `src/` — vendored JS (CreateJS, OpenCV.js)
- `dist/` — build output
- `scripts/` — `generate-icons.ts`
- `icons/` — SVG icons and generated app icons
- `instructions.md` — user-facing help content

### Key Patterns

- **Global state**: a single `master` Project in `globals.ts` holds all application state.
- **Events**: core classes (via `classes/event-emitter.ts`) communicate with `on()` / `trigger()` callbacks.
- **Canvas**: a CreateJS Stage draws overlays (points, tracks, axes, scale) on top of video frames.

### Data Model

```
Project
├── Timeline (video + frame management)
├── Track[] (each tracked object)
│   ├── Point[] (position per frame)
│   └── Table (data grid)
├── Scale (pixel-to-unit mapping)
└── Axes (coordinate system)
```

### File Formats

- `.trackts` — ZIP containing `meta.json` (project data) and `video.mp4`
- Exports: XLSX, CSV, TXT (via SheetJS)

### Webcam Recording

`ts/webcam.ts` and `ts/webcamevents.ts` use `getUserMedia()` and `MediaRecorder` (WebM). MediaRecorder produces WebM files with `Infinity` duration, so `webcamevents.ts` computes the real duration after recording.
