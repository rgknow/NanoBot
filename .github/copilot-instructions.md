# Copilot Instructions for NanoBot

An open-source, educational AI platform with comprehensive safety guardrails, supporting STEAM learning, maker workbench integration, and extensible plugin systems.

## Project Architecture
- **Monorepo**: pnpm workspace with `apps/` (desktop Electron), `packages/` (shared libs), `src/` (main Next.js app)
- **Frontend**: Next.js 15 + React 19 + TypeScript + Turbopack (dev) + Webpack (prod)
- **UI/Styling**: Ant Design + antd-style (CSS-in-JS) + react-layout-kit (flex layouts) + educational UI components
- **State Management**: Zustand with modular slice architecture, SWR for data fetching, nuqs for URL params
- **Database**: Dual-mode - PGLite (client-side) + PostgreSQL (server-side) with Drizzle ORM
- **i18n**: react-i18next with educational content localization (18 languages, zh-CN source)
- **Desktop**: Electron app (`apps/desktop/`) with IPC packages for client-server communication
- **Testing**: Vitest + Testing Library with Happy DOM (client) and Node.js (server) environments

## Developer Workflows

### Package Management & Scripts
```bash
pnpm install              # Install dependencies (monorepo)
bun run dev               # Start development server (port 3010)
bun run build             # Production build
bun run type-check        # TypeScript checking
bun run lint              # Full linting (TS + style + circular deps)
```

### Testing (Critical - 3000+ tests, ~10min full run)
```bash
# ALWAYS use file patterns to avoid running all tests
bunx vitest run --silent='passed-only' '[file-pattern]'

# Examples:
bunx vitest run --silent='passed-only' user.test.ts
bunx vitest run --silent='passed-only' -t "specific test name"

# Package-specific tests:
cd packages/database && bunx vitest run --silent='passed-only' '[pattern]'

# NEVER run these (too slow):
npm test  # Runs all 3000+ tests
bun run test
```

### Database & Schema
```bash
bun run db:generate       # Generate migrations + client types
bun run db:migrate        # Run server-side migrations
bun run db:studio         # Launch Drizzle Studio
```

### i18n Workflow
```bash
# 1. Add keys to src/locales/default/[namespace].ts
# 2. Export namespace in src/locales/default/index.ts
# 3. For preview: only edit locales/zh-CN/[namespace].json
# 4. NEVER manually edit other locale JSON files (CI handles this)
```

## Architecture Patterns

### Zustand State Management
- **Modular slices**: Each feature has `initialState.ts`, `action.ts`, `selectors.ts`
- **Store aggregation**: Top-level stores combine multiple slices
- **Example structure**: `src/store/chat/slices/[feature]/`
- **Pattern**: Actions return immutable updates via Immer

### Database Strategy
- **Dual-mode**: Client-side PGLite for offline + Server-side PostgreSQL for multi-user
- **Migrations**: Automatic client compilation via `scripts/migrateClientDB/compile-migrations.ts`
- **Schema**: Drizzle schemas in `packages/database/src/schemas/`

### Component Architecture
- **Layout**: react-layout-kit for consistent flex layouts
- **Styling**: antd-style with theme tokens, supports light/dark modes
- **Icons**: lucide-react + @ant-design/icons + educational icons
- **Utilities**: ahooks (React hooks), lodash-es, dayjs

### Debugging & Logging
```typescript
import debug from 'debug';
const log = debug('lobe:[module]:[submodule]');
log('Message: %O', data);
```

## Integration Points

### Desktop App (Electron)
- **Location**: `apps/desktop/` with separate package.json
- **IPC**: Shared packages (`electron-client-ipc`, `electron-server-ipc`)
- **Build**: `desktop:build` script creates standalone distribution

### Plugin System & MCP
- **MCP Support**: Model Context Protocol for connecting AI to external tools
- **Plugin Gateway**: Educational plugin system for STEAM learning and maker workbench
- **Function Calling**: Extensible system for AI tool integration

### External Services
- **AI Providers**: 42+ supported (OpenAI, Anthropic, Google, local Ollama, etc.)
- **File Processing**: Multiple loaders (PDF, Office, images) in `packages/file-loaders/`
- **TTS/STT**: Educational speech synthesis for age-appropriate voice interactions

## Configuration Files

### Build & Deploy
- **next.config.ts**: Handles Docker, Desktop builds, CSP, caching, bundle analysis
- **drizzle.config.ts**: Database connection and migration paths
- **vitest.config.mts**: Test configuration with path aliases

### Environment Modes
- **Development**: Turbopack for fast refresh
- **Production**: Webpack with optimization
- **Docker**: Standalone mode with file tracing
- **Desktop**: Electron-specific build with different public path

## Testing Strategy

### Environment Types
- **Client tests** (vitest.config.mts): Happy DOM + PGLite for frontend/components
- **Server tests** (packages/database): Node.js + real PostgreSQL for backend/DB

### Key Testing Rules
1. **Performance**: Always use file filters - never run all tests
2. **Failure handling**: Stop after 1-2 failed attempts, ask for help
3. **Coverage**: Use `--coverage` flag only when needed
4. **Database**: Use `TEST_SERVER_DB=1` for server-side DB tests

## Key Dependencies & Patterns

### Core Stack
- **Routing**: Next.js 15 App Router with middleware
- **Authentication**: NextAuth + Clerk support
- **Real-time**: WebSocket support + server-sent events
- **File Storage**: AWS S3 + local storage options
- **Monitoring**: OpenTelemetry + Langfuse integration

### Development Tools
- **Linting**: ESLint + Stylelint + Prettier with staged commits
- **Git**: Conventional commits with gitmoji prefixes
- **CI/CD**: Automated i18n sync, changelog generation, Docker builds

## Extension Points for Educational AI

### Plugin System (MCP) Extensions
- **Educational Plugins**: Course management, assessment tools, progress tracking
- **Maker Workbench**: Hardware integration (ESP32/Arduino/Pi), block coding, PCB design
- **AI Tutoring**: Specialized educational prompts and learning path recommendations

### Database Schema Extensions
- Add educational tables to existing dual-database system
- Extend user roles (student, teacher, parent, admin) beyond current auth
- Progress tracking and achievement systems using current Drizzle patterns

### UI Component Extensions
- Educational dashboards following existing antd-style patterns
- Progress visualization using current chart integrations
- Maker workbench interfaces with existing file upload/processing

### State Management Extensions
- Educational Zustand slices following current modular architecture
- Course and assessment state management
- Hardware project state with existing persistence patterns

---

📋 **Master Implementation Guide**: See `.github/master-copilot-prompt.md` for comprehensive educational platform extension strategy.

For detailed patterns, consult `AGENTS.md` and `.cursor/rules/`. The codebase is well-documented with specific guides for React components, Zustand patterns, database schemas, testing strategies, and desktop integration.