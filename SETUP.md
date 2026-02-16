# Setup & Next Steps

## ✅ What's Been Set Up

### Monorepo Structure
- **Turbo** — Monorepo orchestration with workspaces
- **TypeScript** — Strict type checking across all packages
- **Path aliases** — `@kernel/*`, `@modules/*`, `@lib/*` for clean imports

### Kernel Infrastructure
Four core kernel modules initialized:

1. **`kernel/auth`** — Supabase authentication (TODO: Implement handlers)
2. **`kernel/tenancy`** — Multi-tenant context and org management (TODO: Implement)
3. **`kernel/entities`** — Core data models (Organizations, Users, Horses, Stalls)
4. **`kernel/events`** — Event bus for pub/sub communication

### Feature Modules
1. **`modules/horse-management`** — Horse profiles, health records, documents (TODO: Complete implementation)

### Database
- SQL migrations in `db/migrations/` (versioned, runnable)
- Drizzle ORM schema definitions in each module
- RLS policies for multi-tenant security

## 🚀 Next Steps

### Phase 1: Immediate (Week 1-2)

1. **Set up Fastify API server**
   - Create `apps/server/` with Fastify setup
   - Add middleware for auth, tenancy context, error handling
   - Wire module registry and route registration

2. **Set up PostgreSQL & Supabase**
   - Create Supabase project
   - Run migrations (001_kernel_initial.sql, 002_horse_management.sql)
   - Configure RLS policies in Supabase UI

3. **Implement kernel/auth**
   - Supabase JWT verification
   - Middleware to extract user context
   - Login/logout/me endpoints

4. **Implement kernel/tenancy**
   - OrgContext extraction from JWT
   - Org membership validation
   - Add tenancy middleware to all routes

### Phase 2: Core Implementation (Week 3-4)

1. **Implement horse-management API**
   - Database queries using Drizzle ORM
   - Create horse profile handler
   - List horses with pagination
   - Add health records
   - Upload documents

2. **Add tests**
   - Unit tests for API handlers
   - Integration tests with database
   - Module config validation tests

3. **React frontend setup**
   - Create `apps/client/` with Vite
   - Set up React Router for navigation
   - Build component library in `packages/ui/`

4. **Frontend pages for horse-management**
   - Horse list page
   - Horse detail page
   - Health records UI
   - Document upload

### Phase 3: Integration & Testing (Week 5-6)

1. **Module registry**
   - Implement module loader at server startup
   - Validate all dependencies resolve
   - Feature flag support

2. **E2E tests**
   - Playwright tests for critical paths
   - Create horse → View list → Edit → Delete

3. **Documentation**
   - API documentation (OpenAPI/Swagger)
   - Module README updates with implementation details

### Phase 4: Beta Rollout (Week 7+)

- Deploy to staging environment
- Invite beta testers
- Monitor and iterate on feedback

## 📁 Directory Reference

```
stable-mgmt-saas/
├── kernel/                      # Kernel modules (all must load)
│   ├── auth/                    # Authentication
│   ├── tenancy/                 # Multi-tenancy
│   ├── entities/                # Core data models
│   └── events/                  # Event bus
├── modules/                     # Feature modules (can be toggled)
│   └── horse-management/        # Module 1
├── apps/
│   ├── server/                  # TODO: Fastify API server
│   └── client/                  # TODO: React frontend
├── packages/
│   ├── lib/                     # Shared types (@lib/core)
│   └── ui/                      # TODO: Shared UI components
├── db/
│   └── migrations/              # SQL migration files
├── package.json                 # Root monorepo config
├── tsconfig.json                # Root TS config
├── turbo.json                   # Turbo build config
└── README.md                    # Project overview
```

## 🔧 Key Commands to Remember

```bash
# Development
npm run dev              # Start all dev servers in parallel

# Testing
npm run test            # Run all tests
npm run test:watch      # Watch mode

# Building
npm run build           # Build all packages
npm run lint            # Run ESLint
npm run type-check      # TypeScript check

# Database
npm run db:migrate      # Run pending migrations (TODO: implement)
npm run db:seed         # Seed test data (TODO: implement)
```

## 📝 Module Creation Checklist

When adding Module 2 & 3, follow this checklist:

- [ ] Create `modules/<module-name>/` directory
- [ ] Create `module.config.ts` with metadata
- [ ] Create `package.json` with dependencies
- [ ] Create `src/schema.ts` with Drizzle schema
- [ ] Create `src/api/handlers.ts` with route handlers
- [ ] Create `src/__tests__/module.test.ts` for validation tests
- [ ] Create `README.md` with overview and API docs
- [ ] Create SQL migration in `db/migrations/`
- [ ] Add module exports in each module's `src/index.ts`

## ⚠️ Important Notes

1. **Strict Mode** — TypeScript is in strict mode (`strictNullChecks: true`, `noImplicitAny: true`). No workarounds.

2. **Module Isolation** — Modules should not directly import from other modules' internals. Use the public API via `module.config.ts`.

3. **RLS Security** — All new tables must have:
   - `org_id` column for tenant
   - RLS policy to isolate by `org_id`
   - Policy should check `user_org_memberships`

4. **Naming** — Follow conventions:
   - Tables: snake_case
   - Files: camelCase (handlers.ts, schema.ts, index.ts)
   - Components: PascalCase
   - Events: `module:action` (e.g., `horses:created`)

5. **Testing** — Aim for >80% coverage. Tests should be in `__tests__/` folders next to source.

## 🆘 Troubleshooting

**Issue:** `Module not found "@kernel/auth"`
- **Solution:** Make sure you ran `npm install` at repo root. Turbo uses symlinked workspaces.

**Issue:** TypeScript errors in IDE
- **Solution:** Reload the TypeScript server (Cmd+Shift+P → TypeScript: Restart TS Server in VSCode)

**Issue:** Database migrations fail
- **Solution:** Check PostgreSQL is running. Make sure Supabase DB connection string is in `.env.local`

---

**Last Updated:** February 15, 2026
**Status:** Ready for Fastify/React implementation
