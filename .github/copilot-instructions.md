# Copilot Instructions for LobeChat

## Project Architecture
- **Monorepo**: Apps in `apps/`, shared libraries in `packages/`, main source in `src/`.
- **Frontend**: Next.js 15, React 19, TypeScript, Ant Design, Zustand, SWR.
- **Backend**: PostgreSQL, PGLite, Drizzle ORM.
- **Desktop**: Electron app in `apps/desktop/`.
- **Testing**: Vitest, Testing Library. Each package has its own `vitest.config.mts`.

## Developer Workflows
- **Install dependencies**: `pnpm install` (monorepo).
- **Build**: Use Next.js and Turbopack (dev) or Webpack (prod).
- **Test**: Run tests with `bunx vitest run --silent='passed-only' '[file-path-pattern]'`. Never run all tests at once.
- **Type check**: `bun run type-check`.
- **i18n**: Add keys to `src/locales/default/namespace.ts`. Only translate `locales/zh-CN/namespace.json` for preview. Never manually edit other locale JSON files.

## Conventions & Patterns
- **TypeScript**: Prefer interfaces for object shapes.
- **State**: Organize Zustand slices and actions per `.cursor/rules/zustand-*` guides.
- **React**: Follow component conventions in `.cursor/rules/react-component.mdc`.
- **Debugging**: Use the `debug` package with namespaced loggers (see `.cursor/rules/debug-usage.mdc`).
- **Database**: Follow Drizzle schema style in `.cursor/rules/drizzle-schema-style-guide.mdc`.
- **Testing**: See `.cursor/rules/testing-guide/testing-guide.mdc` for test structure, naming, and mocking strategies.

## Integration Points
- **Electron**: Desktop features, menu, and window management in `apps/desktop/`.
- **i18n**: Automated via `@lobehub/i18n-cli` (config: `.i18nrc.js`).
- **CI**: i18n sync and other automation handled by CI, not manually.

## Examples
- **Add translation key**: Edit `src/locales/default/common.ts`, export new namespace in `src/locales/default/index.ts`.
- **Run a single test**: `bunx vitest run --silent='passed-only' src/app/features/user.test.ts`.
- **Debug logs**: `import debug from 'debug'; const log = debug('lobe:feature'); log('message');`

## Key Files & Directories
- `AGENTS.md`: Dev guidelines and rules index
- `.cursor/rules/`: All project rules and conventions
- `src/`, `apps/`, `packages/`: Main code structure
- `tests/`: Test setup and utilities

---
For unclear conventions or missing context, consult `AGENTS.md` and `.cursor/rules/`. Ask for feedback if any workflow or pattern is ambiguous.