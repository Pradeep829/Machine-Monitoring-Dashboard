# Machine Monitoring Dashboard

Full-stack assignment combining a Next.js frontend and a NestJS backend to deliver a secure machine-monitoring experience with login, dashboards, detail pages, charting, and optional real-time updates.

**Note:** Only admin@example.com and password123 are the valid credentials

## Stack
- Frontend: Next.js 14, React 18, Tailwind CSS, Recharts, react-select, socket.io-client
- Backend: NestJS 10, TypeORM, SQLite, JWT auth, Socket.IO gateway
- Database: SQLite file at `backend/database.sqlite` seeded with sample machines

## Setup

1. Clone repo  
  
   git clone https://github.com/<your-org>/<repo>.git

   
2. Frontend  
  
   cd frontend
   
   npm install
   npm run dev
   **http://localhost:3000**
      - Visit `/login`, sign in with the same credentials
   - `/dashboard` shows table (name, status, temp, energy)
   - Clicking a row opens `/machines/<slug>` with detail view, edit form, temperature chart, and live updates.
     
4. Backend  

   cd backend
   
   npm install
   npm run start:dev
   **http://localhost:3001**
      - `POST /login` with `admin@example.com` / `password123` → JWT  
   - Protected routes: `GET /machines`, `GET /machines/:id`, `POST /machines/:id/update`  
   - Socket.IO (`machineUpdate`) available on the same host running

## Verification
- Lint: `npm run lint` inside `frontend`
- (Optional) backend tests: `npm run test` inside `backend`
- Manual QA: login, load dashboard, navigate to details, edit values, confirm chart and socket updates

## Submission
- Ensure both apps meet requirements, keep this README, push to a public repo, and share the link via the provided form/email.
