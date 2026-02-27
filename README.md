# Crisis Support Project

A comprehensive web platform built to handle crisis support, real-time emergency reporting, and resource distribution monitoring. The application is built using modern web development standards to ensure scalability, responsiveness, and performance.

---

## 🚀 Important Notice

**When accessing the application (especially on local dev server or via IP on mobile), please make sure to use "Airtel" as the ISP instead of "Jio" to avoid connectivity or network fetch issues.**

---

## 🛠️ Technology Stack

- **Frontend:** Next.js (App Router), React, TypeScript
- **Styling:** Tailwind CSS, shadcn/ui
- **Backend/Database:** Supabase
- **Authentication:** Supabase Auth

---

## ⚙️ How to Use

### Prerequisites

You need `Node.js` installed and a Supabase project set up.

### Environment Setup

Create a `.env.local` file in the root of your project and add your Supabase credentials:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Installation & Running the App

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result. If connecting from a mobile device on the same network, navigate to your computer's local IP address (e.g., `http://192.168.x.x:3000`). **Remember to use an Airtel network as JIO recently started blocking the Dns.**

---

## 🗄️ Data Structure

The application's backend is powered by **Supabase**. The core of the application relies on the following data points:

### Authentication

User authentication is securely handled by **Supabase Auth**. Profiles are managed automatically via Supabase's built-in `auth.users` table.

### Tables

1. **`requests`**
   This table manages all emergency and crisis reports submitted by users.

| Column Name   | Type               | Description                                                                 |
| :------------ | :----------------- | :-------------------------------------------------------------------------- |
| `id`          | `uuid`             | Primary Key, auto-generated.                                                |
| `created_at`  | `timestamp`        | Time the request was submitted.                                             |
| `user_id`     | `uuid`             | Foreign key referencing `auth.users(id)`. Identifies the reporter.          |
| `type`        | `text`             | The type of crisis (e.g., `medical`, `food`, `shelter`, `rescue`, `other`). |
| `description` | `text`             | Detailed description of the situation and needs.                            |
| `location`    | `geography(Point)` | PostGIS Point storing the exact location coordinates (`POINT(lng lat)`).    |

---

## ✨ Current Functionality

As of the current version, the platform includes the following active features:

- **User Authentication:**
  - Complete Login and Registration flows natively integrated with Supabase.
- **Command Center Dashboard:**
  - A secure, authenticated dashboard for users.
  - Real-time display of community metrics (currently mock data for active shelters, food/water drops, and medical assistance).
- **Crisis Reporting System:**
  - Ability to report immediate emergencies.
  - Form validation for crisis types, custom descriptions, and geographic data.
- **Geolocation Integration:**
  - Integrated browser API to automatically fetch the user's current precise location (latitude & longitude) when submitting an emergency report.
- **Responsive Design:**
  - Fully responsive UI accessible across desktop and mobile devices.
