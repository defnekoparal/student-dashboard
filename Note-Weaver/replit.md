# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **AI**: OpenAI via Replit AI Integrations (gpt-5.2 with vision)

## Structure

```text
artifacts-monorepo/
├── artifacts/              # Deployable applications
│   ├── api-server/         # Express API server
│   └── notes-app/          # React + Vite frontend (NotesAI)
├── lib/                    # Shared libraries
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   ├── db/                 # Drizzle ORM schema + DB connection
│   ├── integrations-openai-ai-server/  # OpenAI server-side helpers
│   └── integrations-openai-ai-react/   # OpenAI React hooks
├── scripts/                # Utility scripts (single workspace package)
├── pnpm-workspace.yaml     # pnpm workspace (artifacts/*, lib/*, scripts)
├── tsconfig.base.json      # Shared TS options
├── tsconfig.json           # Root TS project references
└── package.json            # Root package with hoisted devDeps
```

## Application: NotesAI

A web app that lets users upload photos of handwritten or typed notes and transform them using AI.

### Features
- **Upload**: Drag and drop or click to upload note images (JPEG, PNG, etc.)
- **Simplify**: Distill notes into clear bullet points and key concepts
- **Organize**: Structure notes into logical sections with headings
- **Quiz**: Generate multiple-choice quiz questions from note content
- **History**: Browse and revisit all previously processed notes

### API Endpoints (all under `/api/notes/`)
- `POST /api/notes/process` — Upload image + select mode, returns processed result
- `GET /api/notes/history` — List all past processed notes
- `GET /api/notes/history/:id` — Get full details of a specific note
- `DELETE /api/notes/history/:id` — Delete a note

### Database Schema
- `notes` table: id, title, mode, extracted_text, result, image_base64, mime_type, created_at

## TypeScript & Composite Projects

Every package extends `tsconfig.base.json` which sets `composite: true`.

- **Always typecheck from the root** — run `pnpm run typecheck`
- Root `tsconfig.json` lists all lib packages as project references.

## Root Scripts

- `pnpm run build` — runs `typecheck` first, then recursively runs `build` in all packages
- `pnpm run typecheck` — runs `tsc --build --emitDeclarationOnly` using project references

## Packages

### `artifacts/api-server` (`@workspace/api-server`)

Express 5 API server. Routes in `src/routes/`.

- `src/routes/notes.ts` — processes note images via OpenAI Vision, stores in DB
- Depends on: `@workspace/db`, `@workspace/api-zod`, `@workspace/integrations-openai-ai-server`

### `artifacts/notes-app` (`@workspace/notes-app`)

React + Vite frontend at `/` (preview path).

- `src/pages/Home.tsx` — main upload + processing page
- `src/pages/History.tsx` — list of past notes
- `src/pages/NoteDetail.tsx` — detailed view of a note

### `lib/db` (`@workspace/db`)

Database layer using Drizzle ORM with PostgreSQL.

- `src/schema/notes.ts` — notes table definition

### `lib/api-spec` (`@workspace/api-spec`)

OpenAPI spec + Orval codegen config.

Run codegen: `pnpm --filter @workspace/api-spec run codegen`

### `lib/integrations-openai-ai-server` (`@workspace/integrations-openai-ai-server`)

OpenAI server-side helpers using Replit AI Integrations proxy.
Env vars: `AI_INTEGRATIONS_OPENAI_BASE_URL`, `AI_INTEGRATIONS_OPENAI_API_KEY`
