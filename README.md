# 📊 Data Import Panel

A full-stack admin panel for turning spreadsheets into structured, searchable
data. Upload an Excel/CSV file of Students, Teachers, Mentors, Job Seekers,
Institutes or other records — they're validated, imported into MongoDB, and
immediately available in a searchable, filterable, paginated admin table with
full update/delete support. Every number on screen comes from a real
database query, not mock data.

---

## ✨ Features

- **📤 Upload Excel** — drag & drop or browse for `.xlsx`, `.xls` or `.csv`.
  The file is parsed in the browser for an instant preview and required-column
  check, then re-validated on the server before anything touches the database.
- **📋 Manage Data** — live summary cards, category tabs (Students / Teachers /
  Mentors / Job Seekers / Institutes / Others), search by name/email/phone,
  Link Status / Download Status / Date Added filters, row selection,
  pagination, and inline Update/Delete — all backed by real API calls.
- **🏠 Dashboard** — a welcome banner, live stats, and quick links to the rest
  of the app.
- **👤 Users** — full CRUD for admin accounts, paginated.
- **🔐 Authentication** — JWT held in an httpOnly cookie (not `localStorage`),
  so it's invisible to client-side JS and resistant to XSS token theft. A
  single admin account is seeded from environment variables, not hardcoded.

## 🛠 Tech stack

| Layer | Tech |
|---|---|
| Frontend | React 19 · Vite · TypeScript · React Router · Tailwind CSS · Axios |
| Backend | Node.js · Express 5 · TypeScript · Mongoose |
| Database | MongoDB (local or Atlas) |
| Auth | JWT in an httpOnly cookie · bcrypt password hashing |
| File parsing | SheetJS (`xlsx`) — client-side preview, server-side validation |

## 📁 Project structure

```
prac-project/
├── be/   Express + MongoDB API
└── fe/   React + Vite frontend
```

## 🚀 Getting started

### Prerequisites

- Node.js 20+
- A MongoDB connection string (local `mongod`, Docker, or [MongoDB Atlas](https://www.mongodb.com/atlas))

### 1. Backend

```bash
cd be
npm install
cp .env.example .env     # fill in the values — see Environment Variables below
npm run seed              # creates the admin user from ADMIN_EMAIL / ADMIN_PASSWORD
npm run dev                # → http://localhost:5000
```

### 2. Frontend

```bash
cd fe
npm install
cp .env.example .env     # fill in VITE_API_URL
npm run dev                # → http://localhost:5173
```

Log in with the `ADMIN_EMAIL` / `ADMIN_PASSWORD` you seeded.

## 🔑 Environment variables

### `be/.env`

| Variable | Description |
|---|---|
| `PORT` | Port the API listens on (default `5000`) |
| `MONGODB_URI` | MongoDB connection string |
| `CORS_ORIGIN` | The frontend's exact origin (e.g. `http://localhost:5173` in dev, your Vercel URL in prod) |
| `JWT_SECRET` | Long random secret used to sign JWTs |
| `ADMIN_EMAIL` | Email for the seeded admin account |
| `ADMIN_PASSWORD` | Password for the seeded admin account |
| `NODE_ENV` | Set to `production` in deployment — this also switches the auth cookie to `SameSite=None; Secure` for cross-domain requests |

### `fe/.env`

| Variable | Description |
|---|---|
| `VITE_API_URL` | Base URL of the backend API, e.g. `http://localhost:5000/api` |

See `be/.env.example` and `fe/.env.example` for the exact keys — never commit real `.env` files.

## 📥 Importing data

1. Open **Upload Excel**.
2. Your file's header row needs at least `name` and `type` columns. A
   downloadable template with every supported column (`name`, `email`,
   `phone`, `address`, `organisation`, `type`, `linkStatus`,
   `downloadStatus`) is linked right on that page.
3. `type` must be one of `Student`, `Teacher`, `Mentor`, `JobSeeker`,
   `Institute`, `Other`.
4. Preview the parsed rows, confirm, and valid rows are saved to MongoDB.
   Invalid rows are skipped and listed so you know what to fix.
5. New records show up in **Manage Data** immediately — no refresh tricks,
   it's a real query against the database.

## ☁️ Deployment

The frontend and backend deploy to separate platforms.

### Backend → Render (or any Node host)

- **Build command:** `npm install --include=dev && npm run build`
  > Render skips `devDependencies` during install when `NODE_ENV=production`
  > is set — but that's exactly where `typescript` and the `@types/*`
  > packages live. `--include=dev` forces them in for the build step only.
- **Start command:** `npm start`
- Set all the `be/.env` variables above as environment variables on the
  service, with `CORS_ORIGIN` pointing at your deployed frontend's exact URL.
- After the first deploy, run `npm run seed` once (Render's shell tab or a
  one-off job) to create the admin account in the production database.

### Frontend → Vercel

- Framework preset: **Vite**. Build command: `npm run build`. Output
  directory: `dist`.
- Set `VITE_API_URL` to your backend's URL + `/api`
  (e.g. `https://your-api.onrender.com/api`).
- Deploy, then double-check `CORS_ORIGIN` on the backend matches the
  resulting Vercel URL exactly (protocol + host, no trailing slash).

> **Cross-domain cookies**: since the frontend and backend live on different
> domains in production, the auth cookie is issued with `SameSite=None;
> Secure` (only when `NODE_ENV=production`) so the browser will actually send
> it on cross-site API calls.

## 📜 Scripts reference

**Backend** (`be/`)

| Script | Purpose |
|---|---|
| `npm run dev` | Start the API in watch mode |
| `npm run build` | Compile TypeScript → `dist/` |
| `npm start` | Run the compiled API |
| `npm run seed` | Seed the admin user from env vars |

**Frontend** (`fe/`)

| Script | Purpose |
|---|---|
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview the production build locally |
