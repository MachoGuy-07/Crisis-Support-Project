# Crisis Support Project

**Live Demo:** [delightful-cat-3b3731.netlify.app](https://delightful-cat-3b3731.netlify.app/)

A premium, dark-themed, real-time Crisis Support platform designed to seamlessly connect victims in need with active volunteers and NGOs. The platform features role-based dynamic dashboards, interactive geospatial mapping, and instantaneous data synchronization.

## 🌟 Key Features

- **Role-Based Workflows**: Tailored user experiences for `Victim` and `Volunteer` roles post-login.
- **Real-Time Data Sync**: Powered by Supabase Realtime to update request statuses, markers, and counters instantaneously across all clients.
- **Interactive Geospatial Mapping**: Integrated with Leaflet and OpenStreetMap for live tracking of crisis requests, volunteer locations, and nearby NGOs.
- **Dynamic Dashboards**:
  - **Victims** can broadcast emergency requests for food, medical, shelter, and other supplies, and view nearby NGO availability.
  - **Volunteers** can manage personal inventory, view live crisis requests mapped with priority levels, and accept assignments.
- **Secure Authentication**: Seamless integration with Supabase Auth.
- **Premium UI/UX**: Built with Next.js, Framer Motion, and Tailwind CSS, featuring glassmorphism, responsive design, and smooth micro-animations.

## 📸 Screenshots

<div align="center">
  <img src="./Screenshot%20(1).png" alt="Landing Page" width="800">
  <br/><br/>
  <img src="./Screenshot%20(2).png" alt="Role Selection" width="800">
  <br/><br/>
  <img src="./Screenshot%20(3).png" alt="Victim Dashboard & Map" width="800">
  <br/><br/>
  <img src="./Screenshot%20(4).png" alt="Volunteer Request Management" width="800">
</div>

## 🛠️ Technology Stack

- **Frontend**: Next.js 15 (React 19, TypeScript), Tailwind CSS v4, Framer Motion
- **UI Components**: Radix UI, Lucide React, Shadcn UI
- **Backend & Database**: Supabase (PostgreSQL, Auth, Realtime Subscriptions)
- **Mapping**: Leaflet, React Leaflet, OpenStreetMap

## 🔄 User Flow

1. **Authentication**: Users sign up or log in via the `/login` or `/register` pages.
2. **Role Selection**: Post-authentication, users are routed to `/role-select` to identify as either a Victim or Volunteer.
3. **Dashboards**:
   - **Victim (`/dashboard/victim`)**: Can submit new crisis requests, select required supplies, and view their location alongside nearby NGOs on the map.
   - **Volunteer (`/dashboard/volunteer`)**: Can view a live feed of active requests prioritized by urgency, update their available supply inventory, and accept specific crisis requests to provide aid.

## 🗄️ Core Data Models

- **Users/Profiles**: Stores user roles and authentication state.
- **NGOs**: Stores NGO locations, descriptions, and current supply levels.
- **CrisisRequests**: Tracks emergency requests with fields for location (lat/lng), priority (red, orange, green), supply type, and status (open, assigned, closed).
- **VolunteerSupply**: Tracks volunteer inventory (food, medical, shelter amounts).

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or higher
- A Supabase Project with Database and Auth configured

### Environment Variables

Create a `.env.local` file in the project root and add the required configuration. Here is an example of how your variables should look:

```env
# 1. Supabase Configuration (Required for Database, Auth, & Realtime)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...your_anon_key_here

# 2. External API & Socket Configuration (Optional / Legacy)
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000

# 3. Mapbox Configuration (Optional, if using custom Mapbox tiles)
NEXT_PUBLIC_MAPBOX_TOKEN=pk.eyJ1IjoieW91ci11c2VybmFtZSIsImEiOiJjb...
```

*(Note: The legacy backend `.env` variables like `MONGODB_URI` and `PORT` are no longer required as the project now uses Supabase.)*

## Run

Install:

```bash
npm install
```

### Running the Application

Start the development server:

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## 🧪 Validation & Linting

- Run ESLint to check for code quality:
  ```bash
  npm run lint
  ```
- Create a production build:
  ```bash
  npm run build
  ```
