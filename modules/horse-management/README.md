# Horse Management Module

Manage horse profiles with health records, documents, and owner information.

## Features

- **Horse Profiles** — Complete horse identification and ownership data
- **Health Records** — Track vaccinations, medications, vet visits, deworming, injuries
- **Document Management** — Upload and track insurance, registrations, Coggins tests, health certificates
- **Expiration Alerts** — Automatic reminders for document and vaccine expiration
- **Special Needs** — Flag dietary restrictions, medical conditions, behavioral notes

## API Routes

### Horses

- `POST /api/horses` — Create horse profile
- `GET /api/horses` — List all horses (paginated, filterable)
- `GET /api/horses/:id` — Get horse details
- `PATCH /api/horses/:id` — Update horse profile
- `DELETE /api/horses/:id` — Archive horse (soft delete)

### Health Records

- `GET /api/horses/:id/health` — Get health records
- `POST /api/horses/:id/health` — Add health record (vaccination, medication, etc.)
- `PATCH /api/horses/:id/health/:recordId` — Update health record

### Documents

- `GET /api/horses/:id/documents` — List documents
- `POST /api/horses/:id/documents` — Upload document
- `DELETE /api/horses/:id/documents/:docId` — Delete document

### Alerts

- `GET /api/alerts` — Get expiration alerts (documents, vaccines, meds due)

## Database Schema

### horses
Core horse profile table. Owned by kernel/entities.

### health_records
Vaccination, medication, vet visit, deworming, and injury records.

### horse_documents
Insurance, registrations, Coggins, health certificates, and other documents.

## Dependencies

- `kernel/entities` — Horse base model
- `kernel/events` — Publish health/document events
- `kernel/tenancy` — Multi-tenant data isolation

## TODO

- [ ] Implement API handlers with database queries
- [ ] Add file upload to S3 / Supabase Storage
- [ ] Implement expiration alert logic
- [ ] Add health record timelines (visual)
- [ ] Create React components (HorseList, HorseDetail, IntakeChecklist)
- [ ] Add E2E tests with Playwright
- [ ] Document API with OpenAPI/Swagger
