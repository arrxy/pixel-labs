# Repository Guidelines

## Project Structure & Module Organization

This repository is a Vite-powered React and TypeScript application for interactive computer-graphics lessons. Application entry points live in `src/main.tsx` and `src/App.tsx`. Shared UI and styling are in `src/components/` and `src/styles/`.

Lesson code is grouped by subject under `src/modules/`:

- `linear-algebra/` contains lesson sections, reusable components, and vector/matrix utilities.
- `viewing/` contains camera and projection lessons, diagrams, scene helpers, and projection tests.
- `src/assets/` holds imported images; `public/` holds files served unchanged.

Keep domain-specific components, math helpers, and tests inside their module. Place tests beside the implementation as `*.test.ts`.

## Build, Test, and Development Commands

- `npm install` installs the locked dependencies from `package-lock.json`.
- `npm run dev` starts the Vite development server, normally at `http://localhost:5173`.
- `npm run build` type-checks with project references and creates the production bundle.
- `npm test` runs all Vitest tests once.
- `npm run lint` checks source files with Oxlint.
- `npm run preview` serves the production build for local verification.

Before submitting changes, run `npm run lint`, `npm test`, and `npm run build`.

## Coding Style & Naming Conventions

Follow the existing TypeScript style: two-space indentation, single quotes, no semicolons, and trailing commas in multiline structures. Use `PascalCase` for React components and component files, `camelCase` for functions and variables, and descriptive type names such as `ViewBounds`. Keep mathematical helpers pure where possible. TypeScript is configured strictly for unused symbols and switch fallthrough; resolve these errors instead of suppressing them.

## Testing Guidelines

Vitest runs in the Node environment and discovers `src/**/*.test.ts`. Use `describe` blocks for a feature or function and behavior-focused `it` descriptions. Test numeric code with explicit tolerances, including boundary and degenerate cases. There is no configured coverage threshold; new math or transformation logic should nevertheless include focused unit tests.

## Commit & Pull Request Guidelines

Recent history uses very short messages and is not fully consistent. Improve on it with concise, imperative subjects such as `fix projection depth mapping` or `add orthographic interval example`. Keep each commit focused.

Pull requests should explain the user-visible or mathematical change, list validation commands, and link any relevant issue. Include screenshots or recordings for visual, canvas, or lesson-layout changes, and call out changes to coordinate-system or projection conventions explicitly.
