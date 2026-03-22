# Crisis Support Project

Premium dark-themed Crisis Support platform with:
- post-login role selection (`Victim` / `Volunteer`)
- role-based dynamic dashboards
- interactive Mapbox map with live radius overlays
- realtime counters and marker updates via Socket.io
- Express + MongoDB backend services

## Screenshots
<div align="center">
  <img src="./Screenshot%20(1).png" alt="Screenshot 1" width="800">
  <br/><br/>
  <img src="./Screenshot%20(2).png" alt="Screenshot 2" width="800">
  <br/><br/>
  <img src="./Screenshot%20(3).png" alt="Screenshot 3" width="800">
  <br/><br/>
  <img src="./Screenshot%20(4).png" alt="Screenshot 4" width="800">
</div>

## Stack
- Frontend: Next.js (React + TypeScript), Tailwind CSS, Framer Motion
- Backend: Node.js, Express, MongoDB (Mongoose), Socket.io
- Mapping: Mapbox GL JS

## Role Flow
1. Open `/login` and enter email only (no password).
2. App routes to `/role-select`.
3. Choose role:
   - Victim -> `/dashboard/victim`
   - Volunteer -> `/dashboard/volunteer`

## Backend Models
- `Ngo`
- `Inventory`
- `Volunteer`
- `Request`

## API Endpoints
- `GET /api/health`
- `GET /api/dashboard/victim`
- `GET /api/dashboard/volunteer`
- `GET /api/requests`
- `POST /api/requests`
- `POST /api/volunteers/offer`
- `POST /api/volunteers/assign-request`

## Environment Variables
Create `.env.local` in project root for frontend:

```bash
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_public_token
```

Create `.env` in project root for backend (optional defaults exist):

```bash
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/crisis-support
CLIENT_ORIGIN=http://localhost:3000
REALTIME_TICK_MS=9000
```

## Run
Install:

```bash
npm install
```

Run frontend + backend together:

```bash
npm run dev:full
```

Run frontend only:

```bash
npm run dev
```

Run backend only:

```bash
npm run server:dev
```

## Validation
- `npm run lint` passes
- `npm run build` passes
