# CheckMinistry – Order Management System

Full-stack Assessment Project  
Next.js (Frontend) · NestJS (Backend) · Drizzle ORM · PostgreSQL (Neon) · Docker · Jest · ShadCN UI

---

## 🛠 Tech Stack

### Frontend

- Next.js 14
- React
- ShadCN UI
- TailwindCSS
- TypeScript
- Jest + React Testing Library

## Backend

- NestJS
- Drizzle ORM
- PostgreSQL (Neon DB recommended)
- Docker
- Jest

---

## 📌 Prerequisites

You will need:

- Node.js 22+
- Package manager: **Yarn (recommended)** or npm/pnpm
- VS Code
- PostgreSQL connection string
  - Neon DB (recommended)
  - OR Docker PostgreSQL image

---

## 🚀 Backend Setup (NestJS + Drizzle + PostgreSQL)

### 1. Clone the project

```
git clone <repo-url>
```

```sh
cd checkministry-order-management/backend
```

### 2. Create `.env` file in `backend/`

```
DATABASE_URL=postgres://<your-neon-or-docker-db-url>
PORT=4000
```

### 3. Optional: Run PostgreSQL using Docker

```sh
docker run --name checkministry-db \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=orders \
  -p 5432:5432 \
  -d postgres:16
```

Then use:

```
DATABASE_URL=postgres://postgres:password@localhost:5432/orders
```

### 4. Install backend dependencies

Yarn:

```sh
yarn install
```

Or npm:

```sh
npm install
```

### 5. Run Drizzle migrations + seed data

```sh
yarn db:migrate
yarn db:seed
```

These commands:

- Create required tables
- Insert sample **products** data

### 6. Start backend dev server

```sh
yarn dev
```

Backend URL:

```
http://localhost:4000
```

---

## 💻 Frontend Setup (Next.js)

### 1. Go to frontend folder

```sh
cd ../frontend
```

### 2. Create `.env` file in `frontend/`

```
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### 3. Install dependencies

Yarn:

```sh
yarn install
```

Or npm:

```sh
npm install
```

### 4. Run frontend

```sh
yarn dev
```

Frontend URL:

```
http://localhost:3000
```

---

## 🧪 Running Tests

### Backend tests

```sh
yarn test
```

### Frontend tests

```sh
yarn test
```

---

## 🐳 Docker Compatible

The project supports Dockerization for both frontend and backend.
(If you want a ready `docker-compose.yml`, ask and I’ll generate it.)

---

## 📸 Demo Assets

All screenshots and demo video files are inside:

```
/assets/
```
## Assumptions
- I assumed the product quantity would never exceed 10 for this test
- I assumed the API would return orders sorted by newest first
- I assumed authentication is not part of this task.
- I assumed this is not a dockerized or monorepo project due to tight deadline
- I assumed this API returns products to orders mapping is only API level mapping system rather than database level

## Trade-Offs
- I used client-side filtering instead of server-side filtering because it was faster to implement for the assessment timeline.
- I chose Next.js App Router instead of Pages Router for better data-fetching patterns, also app router is modern and new
- I chose Drizzle ORM than Prisma ORM since Prisma isnt still stable and giving me so many errors in seeding phase.