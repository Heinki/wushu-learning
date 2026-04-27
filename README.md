# Wushu Learning

Angular learning app for Wushu judges. It includes Taolu judging criteria, practice questions, mistake tracking, official rule PDFs, and a Sanda rules reference.

## Requirements

- Node.js. Use an active LTS version when possible.
- pnpm. The project enforces pnpm through the `preinstall` script.

Install dependencies:

```bash
pnpm install
```

## Local Development

Start the app locally:

```bash
pnpm start
```

Open `http://localhost:4200/`. The development server reloads when source files change.

## Build

Create a production build for GitHub Pages:

```bash
pnpm build
```

The build writes to `docs/` because GitHub Pages serves this repository from that folder. Angular may create `docs/browser/`; `scripts/move-files.js` moves those files up into `docs/` and keeps the index base URL set to `/wushu-learning/` so the published page works correctly.

## Project Structure

- `src/app/components/` - application pages and UI components.
- `src/assets/data/en/` and `src/assets/data/zh/` - Taolu technique JSON and practice questions.
- `src/assets/data/pdf/` - official Taolu and Sanda rule PDFs.
- `src/assets/i18n/` - English and Chinese UI translations.
- `docs/` - generated GitHub Pages output.

When adding a new Taolu technique category, add its JSON files under both language folders, update each category `index.json`, and include the category in the loader/practice arrays so it appears in judging criteria and practice.

## Useful Commands

```bash
pnpm start
pnpm build
pnpm test
```

## Official Rules

The rule PDFs are included in the app under Resources:

- WUSHU-TAOLU-COMPETITION-RULES-AND-JUDGING-METHODS-2024.pdf
- WUSHU-SANDA-COMPETITION-RULES-JUDGING-METHODS-2024.pdf
