<div align="center">

# ✈️ TripSync

### Collaborative Travel Planning Web App

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-Auth_|_DB_|_Realtime-3FCF8E?logo=supabase&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-7-CA4245?logo=reactrouter&logoColor=white)

**TripSync** is a full-stack travel planning application where users can organize trips, track budgets, manage schedules, discover destination-specific experiences, share trips with collaborators via invite links, and receive real-time recommendations — all from a single dashboard.

Built as a university project for the **Web Programming** course.

[Features](#-features) · [Tech Stack](#-tech-stack) · [Project Structure](#-project-structure) · [Getting Started](#-getting-started) · [Environment Variables](#-environment-variables) · [Architecture Overview](#-architecture-overview) · [Pages & Components](#-pages--components) · [Key Patterns](#-key-patterns) · [API Integrations](#-api-integrations) · [Deployment](#-deployment) · [Authors](#-authors)

</div>

---

## 📋 Features

- **Authentication** — Sign up, sign in, and session management powered by Supabase Auth, with role-based access control (Traveler vs Administrator).
- **Trip Setup** — Configure departure/destination countries, travel dates, and budget. Data syncs automatically to the backend.
- **Budget Tracker** — Add and delete expenses by category. Interactive pie and bar charts (Recharts) visualize spending. Threshold alerts warn at 30%, 50%, 70%, 90%, and 100% usage.
- **Travel Schedule** — Full CRUD for daily activities, grouped and sorted by date and time.
- **Experiences** — Browse a catalog of destination experiences filtered by the user's selected country. Save/unsave experiences with optimistic UI updates stored in Supabase.
- **Experience Detail** — Rich detail view with highlights, included items, eco notes, traveler tips, and dynamic icons.
- **Jet Lag Assistant** — Calculates timezone differences using the REST Countries API and generates personalized adjustment recommendations.
- **Trip Sharing** — Generate invite links and QR codes. Collaborators join a shared trip via token-based invitations.
- **Real-time Recommendations** — Supabase Realtime broadcast channels push new experience recommendations to all users subscribed to the same destination country.
- **Responsive Design** — Mobile-first layout with collapsible sidebar navigation.
- **Admin Panel** — Separate dashboard for managing users, experiences, trips, and analytics _(documented in the Ecosystems course)_.

---

## 🛠 Tech Stack

### Frontend (primary focus of this project)

| Layer                | Technology                   | Version | Purpose                                                            |
| -------------------- | ---------------------------- | ------- | ------------------------------------------------------------------ |
| **UI Library**       | React                        | 19      | Component-based UI with hooks                                      |
| **Language**         | TypeScript                   | 5.9     | Static typing and compile-time safety                              |
| **Build Tool**       | Vite                         | 7       | Fast dev server with HMR and optimized builds                      |
| **Routing**          | React Router                 | 7       | Client-side routing with nested layouts                            |
| **Styling**          | Tailwind CSS                 | 4       | Utility-first styling via `@tailwindcss/vite` plugin               |
| **State Management** | React Context API            | —       | Global state via custom providers (Auth, Trip, Expenses, Realtime) |
| **Forms**            | react-hook-form              | 7.x     | Performant form handling with validation                           |
| **Charts**           | Recharts                     | 3.x     | Pie charts and bar charts for budget visualization                 |
| **Animations**       | motion/react (Framer Motion) | 12.x    | Page transitions and micro-interactions                            |
| **Icons**            | lucide-react                 | 0.577   | Consistent icon set across the app                                 |
| **QR Codes**         | qrcode.react                 | 4.x     | QR generation for trip invite links                                |
| **Auth & Realtime**  | @supabase/supabase-js        | 2.x     | Authentication, database queries, and broadcast channels           |
| **Linting**          | ESLint + Prettier            | —       | Code style enforcement                                             |

### Backend (brief overview)

The backend is a separate project developed for the **Application Ecosystems** course. It is required to run the frontend locally.

| Technology                | Purpose                                                     |
| ------------------------- | ----------------------------------------------------------- |
| Node.js + Express         | REST API server                                             |
| TypeScript + ts-node-dev  | Type-safe development with hot reload                       |
| PostgreSQL (via Supabase) | Relational data storage for trips, expenses, and activities |
| Socket.IO                 | WebSocket server for admin broadcast features               |
| Vercel                    | Production deployment                                       |

---

## 📁 Project Structure

```
TRIPSYNC/
├── backend/                      # Express API (separate course)
│   ├── src/
│   ├── package.json
│   └── vercel.json
│
├── frontend/                     # ⭐ React SPA — main project
│   ├── public/                   # Static assets (logos, banners)
│   ├── src/
│   │   ├── components/           # Reusable UI components
│   │   │   ├── ActionButton/
│   │   │   ├── AlertModal/
│   │   │   ├── BaseModal/
│   │   │   ├── CardHeader/
│   │   │   ├── CountrySelect/    # Searchable country dropdown
│   │   │   ├── DetailCard/
│   │   │   ├── FormCard/
│   │   │   ├── FormField/
│   │   │   ├── IconBadge/
│   │   │   ├── PageHeader/
│   │   │   ├── RealtimeRecommendationToast/
│   │   │   ├── ShareTripModal/   # QR code + invite link modal
│   │   │   ├── Spinner/
│   │   │   ├── SubmitButton/
│   │   │   ├── SummaryCard/
│   │   │   ├── TransactionItem/
│   │   │   ├── admin/            # Admin-specific components
│   │   │   └── layout/
│   │   │       └── Layout.tsx    # Sidebar + route guard
│   │   │
│   │   ├── context/              # Global state providers
│   │   │   ├── AppProviders.tsx  # Provider composition tree
│   │   │   ├── AuthProvider.tsx  # Supabase Auth integration
│   │   │   ├── TripProvider.tsx  # Trip data + backend sync
│   │   │   ├── ExpenseActivityProvider.tsx  # Expenses & activities CRUD
│   │   │   ├── RealtimeProvider.tsx  # Supabase Realtime subscriptions
│   │   │   └── AdminProvider.tsx
│   │   │
│   │   ├── hooks/                # Custom React hooks
│   │   │   ├── useCountries.ts   # REST Countries with module-level cache
│   │   │   └── useExperience.ts  # Supabase experiences + saved state
│   │   │
│   │   ├── lib/                  # Core library setup
│   │   │   ├── supabase.ts       # Supabase client singleton
│   │   │   └── apiClient.ts      # Authenticated HTTP client for backend
│   │   │
│   │   ├── pages/                # Route-level page components
│   │   │   ├── Auth/             # AuthSelector (landing)
│   │   │   ├── Login/
│   │   │   ├── Register/
│   │   │   ├── Dashboard/
│   │   │   ├── TripSetup/
│   │   │   ├── Budget/
│   │   │   ├── AddExpense/
│   │   │   ├── Schedule/
│   │   │   ├── AddActivity/
│   │   │   ├── EditActivity/
│   │   │   ├── Experiences/
│   │   │   ├── ExperienceDetail/
│   │   │   ├── JetLag/
│   │   │   ├── JoinTrip/
│   │   │   ├── Profile/
│   │   │   └── Admin.../         # Admin pages
│   │   │
│   │   ├── services/             # External service integrations
│   │   │   ├── api.ts            # REST Countries API helpers
│   │   │   ├── realtime.service.ts  # Supabase Realtime broadcast
│   │   │   └── unsplash.service.ts  # Unsplash image search (admin)
│   │   │
│   │   ├── types/                # TypeScript type definitions
│   │   │   ├── travel.types.ts   # Expense, Activity, TripDetails, Experience, JetLagPlan
│   │   │   ├── realtime.types.ts # Broadcast payload interfaces
│   │   │   └── admin.types.ts
│   │   │
│   │   ├── constants/            # Static configuration
│   │   ├── data/                 # Extended type definitions (Experience with full fields)
│   │   ├── styles/               # Global CSS and Tailwind entry
│   │   ├── utils/                # Utility mappings (iconsMap)
│   │   │
│   │   ├── App.tsx               # Route definitions
│   │   └── main.tsx              # Entry point (BrowserRouter + App)
│   │
│   ├── index.html
│   ├── vite.config.ts            # Vite config with @ alias and Tailwind plugin
│   ├── tsconfig.json
│   ├── eslint.config.js
│   ├── vercel.json               # SPA rewrite rule for Vercel
│   └── package.json
│
└── README.md
```

Each page and component lives in its own folder following the convention `ComponentName/ComponentName.tsx`.

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9
- A **Supabase** project with Auth enabled and the required tables (`experiences`, `saved_experiences`,`trips`, `trip_members`, `trip_invites`, `profiles`,`expenses`, `activities`)

### 1. Clone the repository

```bash
git clone https://github.com/jeanalo/TRIPSYNC.git
cd TRIPSYNC
```

### 2. Set up the backend

The backend must be running for trips, expenses, and activities to work.

```bash
cd backend
npm install
```

Create a `.env` file in `backend/` with the required variables (see [Environment Variables](#-environment-variables)), then start the dev server:

```bash
npm run dev
# Server starts on http://localhost:3000
```

### 3. Set up the frontend

```bash
cd frontend
npm install
```

Create a `.env` file in `frontend/` with the required variables (see below), then start the dev server:

```bash
npm run dev
# App opens on http://localhost:5173
```

### 4. Open in browser

Navigate to `http://localhost:5173`. You will see the **AuthSelector** page where you can choose Traveler or Administrator access.

---

## 🔐 Environment Variables

### Frontend (`frontend/.env`)

| Variable                   | Description                           | Required |
| -------------------------- | ------------------------------------- | -------- |
| `VITE_SUPABASE_URL`        | Your Supabase project URL             | ✅       |
| `VITE_SUPABASE_KEY`        | Supabase anon/public key              | ✅       |
| `VITE_UNSPLASH_ACCESS_KEY` | Unsplash API key (admin image search) | Optional |
| `VITE_SOCKET_URL`          | Socket.IO server URL (admin realtime) | Optional |

### Backend (`backend/.env`)

| Variable                                                  | Description                        |
| --------------------------------------------------------- | ---------------------------------- |
| `PORT`                                                    | Server port (default: 3000)        |
| `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` | PostgreSQL connection              |
| `SUPABASE_URL`, `SUPABASE_KEY`                            | Supabase credentials (server-side) |
| `CLIENT_URL`                                              | Frontend origin for CORS           |

> **Note:** The `VITE_` prefix is required by Vite to expose variables to the browser. Never put secret keys in `VITE_` variables.

---

## 🏗 Architecture Overview

TripSync uses a **hybrid data architecture** — the frontend communicates with multiple data sources depending on the feature:

```
┌─────────────────────────────────────────────────────────────┐
│                      React Frontend                         │
│                                                             │
│   AuthProvider ──────► Supabase Auth (sessions, users)      │
│                                                             │
│   TripProvider ──────► Backend REST API (/api/trips/me)     │
│   ExpenseActivityProvider ──► Backend (/api/expenses, etc.) │
│                         ▲                                   │
│                         │ Bearer token from Supabase        │
│                         │ session (apiClient.ts)            │
│                                                             │
│   useExperiences ────► Supabase Database (direct queries)   │
│                                                             │
│   RealtimeProvider ──► Supabase Realtime (broadcast)        │
│                                                             │
│   JetLag page ───────► REST Countries API (public)          │
└─────────────────────────────────────────────────────────────┘
```

### Authentication flow

1. User registers/logs in → `supabase.auth.signUp()` / `signInWithPassword()` in `AuthProvider`.
2. Supabase stores the session (token) in browser storage automatically.
3. On app load, `supabase.auth.getSession()` recovers the session; `onAuthStateChange()` listens for future changes.
4. Every request to the backend includes the Supabase session token as `Authorization: Bearer <token>` via `apiClient.ts`.
5. The backend validates the token to identify the user.

### Provider composition order

```tsx
<AuthProvider>
  {" "}
  // Must be outermost — everyone depends on user
  <AdminProvider>
    <TripProvider>
      {" "}
      // Needs useAuth() for user ID
      <ExpenseActivityProvider>
        {" "}
        // Needs useTrip() for tripId
        <RealtimeProvider>
          {" "}
          // Needs useTrip() for destination country
          {children}
        </RealtimeProvider>
      </ExpenseActivityProvider>
    </TripProvider>
  </AdminProvider>
</AuthProvider>
```

The order matters: each inner provider consumes hooks from its parent providers. Reversing the order causes `useContext` to return `undefined`.

---

## 📄 Pages & Components

### Pages

| Page                  | Route                    | Description                                                                                 |
| --------------------- | ------------------------ | ------------------------------------------------------------------------------------------- |
| **AuthSelector**      | `/`                      | Landing page with Traveler vs Admin access selection                                        |
| **Login**             | `/login`                 | Email + password sign-in via Supabase Auth                                                  |
| **Register**          | `/register`              | New user sign-up with name, email, password                                                 |
| **Dashboard**         | `/app`                   | Overview with quick-access cards, schedule preview, and budget summary                      |
| **Trip Setup**        | `/app/setup`             | Configure departure/destination countries and dates via `CountrySelect` + `react-hook-form` |
| **Budget**            | `/app/budget`            | Budget overview with editable total, pie/bar charts, and transaction list                   |
| **Add Expense**       | `/app/budget/add`        | Form to add categorized expenses with over-budget validation                                |
| **Schedule**          | `/app/schedule`          | Activities grouped by date, with edit/delete/detail actions                                 |
| **Add Activity**      | `/app/schedule/add`      | Form to create a new scheduled activity                                                     |
| **Edit Activity**     | `/app/schedule/edit/:id` | Pre-populated form to update an existing activity                                           |
| **Experiences**       | `/app/experiences`       | Filterable grid of experiences for the user's destination country                           |
| **Experience Detail** | `/app/experiences/:id`   | Full detail view with highlights, tips, and eco notes                                       |
| **Jet Lag**           | `/app/jet-lag`           | Timezone calculator with personalized recommendations                                       |
| **Profile**           | `/app/profile`           | View/edit user name, sign out                                                               |
| **Join Trip**         | `/join-trip?token=...`   | Invite acceptance flow (redirects to login if unauthenticated)                              |

### Reusable Components

| Component                     | Purpose                                                                  |
| ----------------------------- | ------------------------------------------------------------------------ |
| `Layout`                      | Sidebar navigation + route guard (redirects to `/login` if no session)   |
| `PageHeader`                  | Consistent page title + subtitle + optional action button                |
| `FormCard`                    | Styled card wrapper for forms (supports `as="form"` for `onSubmit`)      |
| `FormField`                   | Label + icon + input slot with consistent styling                        |
| `DetailCard`                  | Animated card with entrance animation (slide from left/right)            |
| `SummaryCard`                 | Compact card with icon, title, subtitle, and optional link               |
| `CardHeader`                  | Section header within cards with icon + title                            |
| `ActionButton`                | Primary CTA button with icon (supports `to` for navigation or `onClick`) |
| `SubmitButton`                | Form submit button with loading state                                    |
| `CountrySelect`               | Searchable dropdown consuming `useCountries` hook                        |
| `TransactionItem`             | Expense row with icon, category, amount, and optional delete             |
| `IconBadge`                   | Circular icon container with color variants                              |
| `AlertModal`                  | Threshold alert with customizable color, icon, and content               |
| `BaseModal`                   | Backdrop + centered modal with close-on-overlay-click                    |
| `ShareTripModal`              | QR code display + copy-to-clipboard for invite links                     |
| `RealtimeRecommendationToast` | Floating notification for incoming broadcast recommendations             |
| `Spinner`                     | Loading indicator                                                        |

---

## 🔑 Key Patterns

### Module-level cache for API calls (`useCountries`)

```ts
let cache: CountryOption[] | null = null; // lives outside the hook
let promise: Promise<CountryOption[]> | null = null;

export function useCountries() {
  // if cache exists, return immediately — no network call
  // if promise exists, reuse it (deduplication)
  // cleanup flag `live` prevents state updates on unmounted components
}
```

The country list is fetched once and shared across all `CountrySelect` instances via module-scope variables.

### Optimistic updates (`useExperience.toggleSave`)

The UI updates immediately before the Supabase write completes. If the write fails, the change is reverted. This eliminates perceived latency for save/unsave actions.

### Ref-based sync guards (`TripProvider`)

`isLoadedRef` prevents the sync-to-backend effect from firing during the initial data load (which would cause a pointless re-save). `tripIdRef` provides synchronous access to the latest trip ID inside async callbacks, avoiding stale closure reads from `useState`.

### Per-user localStorage isolation

Storage keys are prefixed with the user's email via `getKey(key, email)` so that multiple users on the same browser don't see each other's local data.

### Defensive context hooks

Every custom context hook (`useAuth`, `useTrip`, `useExpenseActivity`, `useRealtime`) checks for `undefined` and throws a descriptive error message if called outside its provider:

```ts
export const useTrip = () => {
  const context = useContext(TripContext);
  if (context === undefined) {
    throw new Error("useTrip must be used within a TripProvider");
  }
  return context;
};
```

---

## 🌐 API Integrations

### Supabase (Auth + Database + Realtime)

- **Auth:** `signUp`, `signInWithPassword`, `signOut`, `getSession`, `onAuthStateChange`, `updateUser`
- **Database:** Direct queries to `experiences` and `saved_experiences` tables from the frontend via `supabase.from(...).select/insert/delete`
- **Realtime:** Broadcast channels (`recommendations:<country>`) for pushing live recommendations to subscribed users

### REST Countries API

- Endpoint: `https://restcountries.com/v3.1`
- Used in `useCountries` to populate the country selector (name, flag, flag image)
- Used in `JetLag` to fetch timezone data for departure and destination countries

### Backend REST API

- Base URL: `http://localhost:3000` (development)
- Authenticated via Supabase Bearer tokens
- Endpoints: `/api/trips/me`, `/api/expenses`, `/api/activities`, `/api/trips/:id/invite`, `/api/trips/join`

---

## 🚢 Deployment

### Frontend

Deployed on **Vercel**. The `vercel.json` rewrites all routes to `index.html` for client-side routing:

```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```

### Backend

Also deployed on **Vercel** using `@vercel/node` serverless functions.

### Build command

```bash
cd frontend
npm run build     # outputs to dist/
```

---

## 🗺 Roadmap

- [x] Multi-page routing with protected routes
- [x] Supabase Auth integration with role-based access
- [x] Trip setup with REST Countries API
- [x] Budget tracker with charts and threshold alerts
- [x] Full CRUD for expenses and scheduled activities
- [x] Experiences catalog filtered by destination country
- [x] Save/unsave experiences with optimistic updates
- [x] Jet lag calculator with personalized recommendations
- [x] Trip sharing via invite links and QR codes
- [x] Real-time recommendation broadcast
- [x] Responsive mobile layout
- [x] Admin panel for platform management

---

## 👥 Authors

| Name          | GitHub                                                   |
| ------------- | -------------------------------------------------------- |
| **Jean**      | [@jeanalo](https://github.com/jeanalo)                   |
| **Valentina** | [@ashleybarreiro11](https://github.com/ashleybarreiro11) |

---

## 📝 Git Conventions

This project follows semantic commit messages:

| Prefix   | Usage                                   |
| -------- | --------------------------------------- |
| `feat:`  | New feature                             |
| `fix:`   | Bug fix                                 |
| `style:` | Styling or UI changes (no logic change) |
| `chore:` | Maintenance, dependencies, config       |

Commits are written in English, imperative mood, max 50 characters. Branching strategy: feature branches → `develop` → `main` via Pull Requests.

---

## 📄 License

University project — not licensed for commercial use.
