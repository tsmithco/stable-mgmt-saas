# Stable Management SaaS

A modern, modular SaaS platform for horse barn management. Multi-tenant, designed for small-to-mid-size barns.

## Project Status

🚀 **Phase 1 MVP Development** (Started February 2026)

Building core modules:
- ✅ Kernel infrastructure (auth, tenancy, entities, events)
- ✅ Horse Management module scaffolded
- ⏳ Stall Management module (Phase 2)
- ⏳ Barn Work Schedule module (Phase 3)

## Tech Stack

- **Runtime:** Node.js (Fastify) + TypeScript
- **Database:** PostgreSQL with Drizzle ORM
- **Auth:** Supabase Auth
- **Frontend:** React + Vite
- **Monorepo:** Turbo
- **Testing:** Vitest + Playwright

## Project Structure

```
stable-mgmt-saas/
├── kernel/                    # Kernel modules (auth, tenancy, entities, events)
│   ├── auth/
│   ├── tenancy/
│   ├── entities/
│   └── events/
├── modules/                   # Feature modules
│   ├── horse-management/      # Module 1: Horse profiles & health records
│   ├── stall-management/      # Module 2: Visual stall board (TODO)
│   └── barn-work-schedule/    # Module 3: Daily task management (TODO)
├── packages/
│   ├── lib/                   # Shared types and utilities
│   └── ui/                    # Shared UI components (TODO)
├── apps/
│   ├── server/                # Fastify API server
│   └── client/                # React frontend
├── db/
│   └── migrations/            # SQL migration files
└── tsconfig.json              # Root TypeScript config
```

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- Supabase account (for Auth)

### Installation

```bash
# Clone repository
git clone <repo-url>
cd stable-mgmt-saas

# Install dependencies
npm install

# Create .env.local in apps/server
cp .env.example .env.local

# Set up database
npm run db:migrate

# Start development
npm run dev
```

This will start:
- API server on `http://localhost:3000`
- React frontend on `http://localhost:5173`

### Development Workflow

```bash
# Run all dev servers
npm run dev

# Run tests
npm run test

# Run tests in watch mode
npm run test:watch

# Build for production
npm run build

# Run linter
npm run lint

# Type check
npm run type-check
```

## Module System

This project uses a **modular architecture** where features are organized into independently deployable modules.

Each module:
- Has its own `module.config.ts` declaring metadata, routes, tables, events
- Declares explicit dependencies on other modules
- Exposes a public API
- Can be enabled/disabled via feature flags
- Publishes domain events for other modules to consume

### Creating a New Module

See the planning documents in `~/Library/CloudStorage/OneDrive-Personal/Projects/Obsidian Notes/Tim's Notes/Projects/Personal/stable-mgmt-saas/DEVELOPMENT_FRAMEWORK.md` for detailed instructions.

### Core Modules (Kernel)

| Module | Purpose |
|--------|---------|
| `kernel/auth` | Supabase authentication and JWT verification |
| `kernel/tenancy` | Multi-tenant data isolation via RLS |
| `kernel/entities` | Core data models: Organizations, Users, Horses, Stalls |
| `kernel/events` | Pub/sub event bus for inter-module communication |

### Feature Modules

| Module | Status | Purpose |
|--------|--------|---------|
| `horse-management` | 🚀 In Development | Horse profiles, health records, documents |
| `stall-management` | ⏳ TODO | Visual stall board with drag-and-drop |
| `barn-work-schedule` | ⏳ TODO | Daily task management and completion tracking |

## API Documentation

### Authentication

All API requests require a Supabase JWT token in the `Authorization` header:

```bash
Authorization: Bearer <token>
```

### Base URL

```
http://localhost:3000/api
```

### Example: Get Horses

```bash
curl -H "Authorization: Bearer $JWT_TOKEN" \
  http://localhost:3000/api/horses?org=123
```

## Database

### Migrations

Migrations are versioned SQL files in `db/migrations/`:

```bash
# Run pending migrations
npm run db:migrate

# Create a new migration
npm run db:migrate:create "name_of_migration"
```

### Multi-Tenancy & Security

All tables have:
- `org_id` column for tenant isolation
- RLS (Row-Level Security) policies to prevent cross-tenant data leakage
- Automatic filtering via `user_org_memberships`

Example RLS policy:
```sql
CREATE POLICY horses_org_isolation ON horses
  USING (org_id IN (
    SELECT org_id FROM user_org_memberships
    WHERE user_id = auth.uid()::text
  ));
```

## Testing

### Unit Tests

```bash
npm run test
```

Tests are in `__tests__` folders alongside source code.

### End-to-End Tests

```bash
npm run test:e2e
```

E2E tests use Playwright and test complete user workflows.

### Coverage

```bash
npm run test:coverage
```

Target: >80% coverage per module.

## Deployment

### Staging

```bash
npm run deploy:staging
```

### Production

```bash
npm run deploy:prod
```

## Documentation

Key planning documents are in the notes directory:
- `00 - Project Overview` — Vision and scope
- `01 - Competitive Landscape` — Market analysis
- `03 - Feature Requirements` — Detailed feature specs
- `07 - Architecture` — Technical architecture
- `08 - Phase 1 MVP Plan` — Development roadmap
- `DEVELOPMENT_FRAMEWORK.md` — Module system guide

## Contributing

See DEVELOPMENT_FRAMEWORK.md for development workflow and module creation guidelines.

## Support

Questions? Contact tim@example.com

## License

Proprietary — All rights reserved
