# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run setup        # First-time setup: install deps + generate Prisma client + migrate DB
npm run dev          # Start dev server with Turbopack
npm run build        # Production build
npm run lint         # Run ESLint
npm run test         # Run all Vitest tests
npm run db:reset     # Force reset SQLite database
```

Run a single test file:
```bash
npx vitest run src/components/chat/__tests__/ChatInterface.test.tsx
```

## Architecture

UIGen is an AI-powered React component generator with live preview. Users describe components in chat, Claude generates/modifies files in a virtual file system, and the result renders live in an iframe.

### Request Flow

1. User message → `ChatContext` → `POST /api/chat` (streaming via Vercel AI SDK)
2. `route.ts` calls `streamText()` with system prompt + current file system state + two tools
3. Claude responds with tool calls (`str_replace_editor`, `file_manager`) to create/modify files
4. `FileSystemContext` updates state in real-time as tool results stream back
5. `PreviewFrame` detects file changes → Babel transforms JSX client-side → renders in iframe
6. If authenticated: project (messages + file data) is persisted to SQLite via Prisma

### Key Contexts

- **`FileSystemContext`** (`src/lib/contexts/file-system-context.tsx`): Central state. Wraps a `VirtualFileSystem` class instance. All file reads/writes go through here.
- **`ChatContext`** (`src/lib/contexts/chat-context.tsx`): Wraps Vercel AI SDK's `useChat`, maintains message history, exposes `sendMessage`.

### Virtual File System

`src/lib/file-system.ts` — in-memory tree structure (no disk I/O). Serializes to JSON for database storage. AI tools manipulate it via:
- `str_replace_editor` tool (`src/lib/tools/str-replace.ts`): create files, str_replace, insert
- `file_manager` tool (`src/lib/tools/file-manager.ts`): rename, delete

### AI Provider

`src/lib/provider.ts` — returns Anthropic Claude if `ANTHROPIC_API_KEY` is set in `.env`, otherwise falls back to a mock provider that returns canned responses. No key is required to run the app locally.

### Authentication

JWT-based using `jose`. Session stored in a cookie. `src/middleware.ts` guards `/[projectId]` routes. Server actions in `src/actions/` handle sign-up/in/out using bcrypt + Prisma.

### Code Transformation

`src/lib/transform/jsx-transformer.ts` — uses `@babel/standalone` to compile JSX to JavaScript in the browser. Import maps resolve virtual FS modules and CDN dependencies for the iframe sandbox.

### Routing

- `/` — Home (anonymous users land here; authenticated users are redirected to their latest project)
- `/[projectId]` — Protected project page with full editor/chat/preview layout
- `/api/chat` — Streaming AI endpoint

### Database

Prisma + SQLite. Schema: `User` (email, passwordHash) → has many `Project` (name, messages JSON, fileData JSON). Generated client output is at `src/generated/prisma/`.

## Environment

Copy `.env` and add your key to enable real AI responses:
```
ANTHROPIC_API_KEY=sk-ant-...
```
