This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a full-stack web application for the Ministry of Transport and Civil Aviation of Niger (Ministère des Transports et de l'Aviation Civile du Niger). The portal provides online services for transport-related administrative procedures, public tenders, news, events, and project tracking.

**Stack:**

- **Frontend:** React + TypeScript + Vite + TailwindCSS + shadcn/ui components
- **Backend:** Express.js (TypeScript) with Node.js
- **Database:** PostgreSQL
- **Authentication:** JWT with refresh tokens (dual auth system: new JWT refresh flow + legacy admin tokens)

## Development Commands

### Frontend

```bash
npm run dev              # Start Vite dev server (default: http://localhost:5173)
npm run build            # Production build
npm run build:dev        # Development build
npm run preview          # Preview production build
npm run lint             # Run ESLint
```

### Backend

```bash
npm run dev:server       # Start Express server with nodemon (default: http://localhost:3001)
```

### Running Both Servers

You need to run both frontend and backend simultaneously:

- Terminal 1: `npm run dev` (frontend)
- Terminal 2: `npm run dev:server` (backend)

## Database Setup

### Initial Setup

1. Create PostgreSQL database: `ministere_transports_niger`
2. Run schema: `psql -U postgres -d ministere_transports_niger -f database/schema.sql`
3. Default admin user is created automatically on first server start:
   - Username: `admin`
   - Email: `admin@transport-niger.ne`
   - Password: `admin123`

### Database Structure

The database schema is in `database/schema.sql`. Additional SQL files:

**Key tables:**

- `utilisateurs` - Users with roles (admin, editeur, consultant), 2FA support
- `actualites` - News articles
- `appels_offres` - Public tenders with documents
- `demandes_services` - Service requests with document attachments
- `evenements` - Events with images and location
- `projects` - Projects with tracking and progress
- `sessions_utilisateurs` - User sessions (refresh tokens)

### E-Services System

The application provides online service request forms for transport-related procedures. Each service has:

- Dedicated form page (e.g., `src/pages/PermisConduire.tsx`, `src/pages/HomologationVehicule.tsx`)
- Backend routes: `POST /api/services/:serviceType/submit` (public), admin routes under `/api/admin/services`
- Document upload capabilities (stored in `private_uploads/`)
- Status tracking: brouillon → soumis → en_cours → approuve/rejete/termine

**Supported service types** (defined in `type_service` enum):

- `permis_conduire`, `permis_international`
- `homologation_vehicule`, `demande_homologation_simple`, `demande_transformation_vehicule`
- `carte_grise_internationale`, `mise_en_gage_vehicule`
- `autorisation_transport_marchandises`, `autorisation_transport_personnes`
- `permis_exploitation_ligne_transport`, `agrement_transport_produits_strategiques`
- `lien_anac`

## Architecture

### Frontend Structure

- **`src/pages/`** - Page components (Index, Admin, Events, Projects, etc.)
  - `src/pages/admin/` - Admin-specific pages
- **`src/components/`** - Reusable components (Hero, Footer, Navbar, forms, etc.)
  - `src/components/ui/` - shadcn/ui primitives
- **`src/services/`** - API service layers (authService, eventService, projectService, etc.)
- **`src/api.ts`** - Axios instance with interceptors for auth and token refresh

### Backend Structure

- **`server/src/index.ts`** - Express app entry point
- **`server/src/routes/`** - Route definitions (auth, news, events, projects, tenders, users, profile, upload, stats, services, adminServices)
- **`server/src/controllers/`** - Request handlers
- **`server/src/middleware/`** - Auth, validation, file upload
- **`server/src/auth/`** - JWT token generation and refresh logic
- **`server/src/db.ts`** - PostgreSQL connection pool

**Note:** Backend runs with `tsx` and `nodemon` for hot-reload, no build step in development.

### Authentication System

The application uses a **dual authentication system**:

1. **New JWT Refresh Flow** (preferred):

   - Access tokens (15min) + refresh tokens (7d)
   - Refresh tokens stored in httpOnly cookies
   - Access tokens in memory, attached via axios interceptor
   - Login: `POST /api/auth/login` → returns `accessToken` + sets refresh cookie
   - Refresh: `POST /api/auth/refresh` → returns new `accessToken`
   - Logout: `POST /api/auth/logout` → clears refresh cookie

2. **Legacy Admin Token Flow** (backward compatibility):
   - Single long-lived token
   - Stored in `localStorage` as `admin_token`
   - Route: `GET /api/auth/admin-token`

**Token Configuration:**

- Access secret: `JWT_ACCESS_SECRET` (default: "access-secret-demo")
- Refresh secret: `JWT_REFRESH_SECRET` (default: "refresh-secret-demo")
- Legacy secret: `JWT_SECRET` (default: "votre_clé_secrète_très_longue_et_sécurisée")

**Key Files:**

- `server/src/auth/tokens.ts` - Token signing/verification
- `server/src/auth/refreshStore.ts` - Refresh token storage
- `server/src/auth/cookies.ts` - Cookie handling
- `server/src/middleware/auth.ts` - Auth middleware (`checkAuth`, `checkAdmin`)
- `src/api.ts` - Frontend axios interceptor with automatic refresh
- `src/services/authService.ts` - Frontend auth service

### File Uploads

- Handled by `multer` middleware
- **Public uploads:** `server/uploads/` served at `/uploads` (news images, event images, project images)
- **Private uploads:** `server/private_uploads/` served at `/private_uploads` (service request documents, attachments)
- Upload route: `POST /api/upload`

### Path Aliases

TypeScript path alias `@/*` maps to `./src/*` (configured in tsconfig.json and vite.config.ts)

Example: `import { Button } from "@/components/ui/button"`

## Environment Variables

**Backend** (`.env` in root or `server/.env`):

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ministere_transports_niger
DB_USER=postgres
DB_PASSWORD=your_password

# JWT Secrets
JWT_SECRET=your_legacy_jwt_secret
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret

# Email (for OTP/notifications)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Server
PORT=3001
NODE_ENV=development
```

**Frontend** (`.env` in root):

```env
VITE_API_URL=http://localhost:3001/api
```

## API Proxy Configuration

**Development:** Vite proxies `/api` requests to `http://localhost:3001` (see `vite.config.ts`). This avoids CORS issues.

**Production:** Update CORS origin in `server/src/index.ts` (currently hardcoded to `http://localhost:5173`) to match your production frontend URL. Also ensure `VITE_API_URL` env var points to production backend.

## Key Patterns

### Protected Routes

Backend routes use middleware for authorization:

- `checkAuth` - Requires valid JWT (access or legacy token)
- `checkAdmin` - Requires admin role
- `checkAdminOrSelf` - Admin or user modifying own account

Example:

```typescript
router.get("/profile", checkAuth, profileController.getProfile);
router.delete("/users/:id", checkAuth, checkAdmin, userController.deleteUser);
```

**Important:** Both new JWT refresh flow and legacy admin token are supported by `checkAuth` middleware.

### API Calls from Frontend

Use service modules (`src/services/*.ts`) which use the configured `api` instance from `src/api.ts`. The axios interceptor automatically attaches access tokens and handles refresh on 401 errors.

Example:

```typescript
import { api } from "../api";
const response = await api.get("/events");
```

### Database Queries

Use the `pool` instance from `server/src/db.ts`:

```typescript
import pool from "../db";
const result = await pool.query("SELECT * FROM utilisateurs WHERE id = $1", [
  userId,
]);
```

## Documentation & API Testing

### Documentation

The `docs/` directory contains detailed implementation guides:

- **Authentication:** `DEBUG_AUTH.md`, `TEST_AUTH_FINAL.md`, `TOKEN_FIX.md`, `2FA_GUIDE.md`, `2FA_IMPLEMENTATION_GUIDE.md`
- **Features:** `EVENTS_GUIDE.md`, `DEBUG_EVENTS.md`, `TENDERS_DYNAMIC_GUIDE.md`, `TENDERS_DYNAMIC_FINAL.md`
- **Admin:** `ADMIN_PROFILE_USERS_GUIDE.md`, `DASHBOARD_TROUBLESHOOTING_GUIDE.md`
- **Legal Pages:** `LEGAL_PAGES_GUIDE.md`, `LEGAL_PAGES_SIMPLIFIED.md`
- **Navigation:** `NAVIGATION_FIX.md`, `NAVIGATION_TEST.md`
- **Configuration:** `ENV_VARIABLES_GUIDE.md`, `SERVER_FIX.md`

### Postman Collection

API endpoints can be tested using the included Postman collection:

- `Niger_Transport_API.postman_collection.json` - Complete API collection
- `Niger_Transport_API.postman_environment.json` - Environment variables
- `POSTMAN_GUIDE.md` - Usage instructions

## Testing & Debugging

### Database Connection Issues

Check:

- PostgreSQL service is running
- Database exists and credentials in `.env` are correct
- Connection logs in server console (connection details are logged on startup)

## Important Notes

- **TypeScript Configuration:** `noImplicitAny`, `strictNullChecks`, `noUnusedLocals`, and `noUnusedParameters` are disabled for flexibility
- **shadcn/ui:** UI components from shadcn are in `src/components/ui/` and configured via `components.json`
- **Styling:** TailwindCSS with custom config in `tailwind.config.ts`
- **Server Logs:** Database connection details are logged on server startup for debugging
