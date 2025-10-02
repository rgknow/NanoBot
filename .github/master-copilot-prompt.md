# 🧑‍💻 Master Prompt for Copilot: Extend NanoBot for Educational AI Platform

**System Goal:**
Extend the existing **NanoBot** educational AI platform to support advanced educational features, maker workbench integrations, and STEAM learning capabilities with comprehensive safety guardrails.

---

## 🏗️ Step 1. Leverage Existing Architecture

* **Current Foundation**: Next.js 15 + React 19 + TypeScript monorepo with Zustand state management
* **Database**: Extend current dual-mode (PGLite + PostgreSQL) with education-focused schemas
* **Authentication**: Build on existing NextAuth + Clerk to add role-based access (student, teacher, parent, admin)
* **Plugin System**: Utilize existing MCP (Model Context Protocol) for educational tools integration
* **Desktop App**: Extend Electron app with maker workbench capabilities

---

## 🔧 Step 2. Backend Extensions (Build on Existing tRPC/Server Structure)

Extend `src/server/routers/` with new educational modules:

* **Education Router** (`src/server/routers/education/`):
  * `courses.ts` → STEAM curriculum, lessons, project management
  * `assessments.ts` → Adaptive learning engine, AI scoring, progress tracking
  * `maker.ts` → Hardware integration APIs (ESP32/Arduino/Pi, MODI robotics)
  * `analytics.ts` → Learning analytics, progress cards, skill radar charts
  * `certificates.ts` → Achievement tracking, QR-verified credentials

* **Database Schemas** (extend `packages/database/src/schemas/`):
  * `education.ts` → courses, lessons, user_progress, achievements
  * `maker.ts` → projects, hardware_configs, code_submissions
  * `assessments.ts` → rubrics, submissions, ai_feedback

---

## 🎨 Step 3. Frontend Extensions (Build on Existing UI Components)

Extend `src/app/` with educational dashboards:

* **Student Dashboard** (`src/app/student/`):
  * Course browser with integrated AI tutor chat
  * Maker workbench with block coding → hardware deployment
  * Progress visualization using existing chart components
  
* **Teacher Dashboard** (`src/app/teacher/`):
  * Class management with AI-assisted rubric creation
  * Student progress analytics with radar charts
  * Bulk assessment tools with LLM integration

* **Maker Workbench** (`src/app/maker/`):
  * Visual block coding interface (extend existing UI patterns)
  * Hardware simulation and deployment tools
  * Integration with existing file upload system for PCB/CAD files

* **Components** (extend `src/components/`):
  * `ProgressRadar` → skill visualization using existing chart library
  * `HardwareConfig` → device setup with existing form patterns
  * `AITutor` → specialized chat interface for educational context

---

## 🤖 Step 4. AI Integrations (Extend Existing Provider System)

Build on existing 42+ AI provider support in `packages/model-runtime/`:

* **Educational Providers** (`packages/model-runtime/src/libs/education/`):
  * Specialized prompts for tutoring, assessment, rubric generation
  * STEAM-focused model fine-tuning integration
  * Code review and debugging assistance for maker projects

* **Maker AI Tools** (new MCP plugins):
  * Block-to-code transpilation (Blockly → Python/C++)
  * PCB design assistant (Flux AI integration)
  * 3D CAD guidance (Onshape/Fusion AI)
  * Hardware debugging assistant

* **Assessment Engine** (`src/services/education/`):
  * AI-powered rubric scoring
  * Automated feedback generation
  * Learning path recommendation

---

## 📊 Step 5. Analytics & Progress Tracking

Extend existing analytics capabilities:

* **Progress Cards** (build on existing dashboard patterns):
  * Radar charts for skill assessment
  * AI-generated learning insights
  * Parent/teacher progress reports

* **Achievement System** (new `src/features/achievements/`):
  * Tier-based progression (Emerging Innovator → Global Genius Maker)
  * QR-verified digital certificates
  * Integration with existing user profile system

---

## 🔬 Step 6. Testing (Extend Existing Vitest Setup)

Build on current 3000+ test suite:

* **Educational Tests** (`src/app/education/**.test.ts`):
  * Course management functionality
  * Assessment engine accuracy
  * Progress tracking integrity

* **Maker Tests** (`src/app/maker/**.test.ts`):
  * Block coding transpilation
  * Hardware integration endpoints
  * File processing for PCB/CAD

* **Integration Tests** (extend `tests/`):
  * AI tutor conversation flows
  * Multi-role dashboard interactions
  * Hardware deployment pipelines

---

## 🚀 Step 7. DevOps (Build on Existing Docker/Deployment)

Extend current deployment strategy:

* **Docker Extensions** (update existing `Dockerfile`):
  * Add hardware simulation tools
  * Include educational AI model dependencies
  * Maker toolchain integration

* **Environment Variables** (extend existing env system):
  * Educational provider API keys
  * Hardware integration endpoints
  * Assessment engine configurations

* **Database Migrations** (extend `packages/database/migrations/`):
  * Educational schema updates
  * Progress tracking tables
  * Achievement system tables

---

## 📄 Step 8. Documentation (Extend Existing Docs)

Build on existing comprehensive documentation:

* **Educational Guide** (`docs/education/`):
  * Course creation workflow
  * Assessment configuration
  * AI tutor customization

* **Maker Workbench** (`docs/maker/`):
  * Hardware setup guides (ESP32/Arduino/Pi/MODI)
  * Block coding to deployment workflow
  * PCB/CAD integration tutorials

* **Developer Guide** (extend existing):
  * Educational plugin development
  * Custom assessment engine creation
  * Hardware integration patterns

---

## 🧩 Step 9. Implementation Strategy

* **Phase 1**: Core educational schemas and basic course management
* **Phase 2**: AI tutor integration and assessment engine
* **Phase 3**: Maker workbench and hardware integration
* **Phase 4**: Advanced analytics and certification system
* **Phase 5**: Mobile app extensions and offline capabilities

---

### 🔑 Master Prompt to Copilot

> "You are extending the NanoBot educational AI platform for advanced learning capabilities. Build on the existing Next.js 15 + React 19 + TypeScript monorepo architecture with Zustand state management, dual-database system (PGLite + PostgreSQL), and 42+ AI provider support with comprehensive safety guardrails. 
> 
> Add educational modules: course management, AI tutoring, maker workbench (ESP32/Arduino/Pi integration), assessment engine with AI scoring, progress analytics with radar charts, and achievement systems. 
>
> Maintain existing patterns: tRPC for API layer, MCP for plugins, antd-style for UI, modular Zustand slices for state, Vitest for testing (3000+ test suite), and comprehensive documentation.
>
> Code with TypeScript strict mode, proper error handling, internationalization support (18 languages), and production-ready security. Follow existing conventions in `.cursor/rules/` and maintain backward compatibility with current chat functionality.
>
> Generate database migrations, API endpoints, React components, state management, tests, and documentation following the established project patterns."

---

## 🚀 Quick Start Commands

```bash
# Development (extends existing workflow)
pnpm install
bun run dev  # Now includes educational modules at /education, /maker, /teacher

# Database (extends existing schema)
bun run db:generate  # Includes educational tables
bun run db:migrate   # Updates schema with education features

# Testing (extends existing 3000+ test suite)
bunx vitest run --silent='passed-only' 'education'  # Educational tests
bunx vitest run --silent='passed-only' 'maker'      # Maker workbench tests

# Build (extends existing build process)
bun run build  # Includes educational dashboard and maker tools
```

---

This approach leverages NanoBot's robust foundation while adding comprehensive educational capabilities, maintaining the existing architecture's strengths and development workflows.