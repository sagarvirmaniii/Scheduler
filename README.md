# Scheduler

A full-stack scheduling platform that lets you share a booking link, set your availability, and let others book meetings with you — no back-and-forth emails needed.

**Live Demo:** [scheduler-frontend-ecru-two.vercel.app](https://scheduler-frontend-ecru-two.vercel.app)

> Demo credentials — Email: `admin@scheduler.com` · Password: `admin123`

---

## Screenshots

| Dashboard | Event Types | Public Booking Page |
|-----------|-------------|---------------------|
| Stat cards, upcoming bookings | Manage bookable event types | Anyone can book a meeting |

---

## Features

### For the Host (Dashboard)
- **Authentication** — Secure register & login with JWT
- **Event Types** — Create multiple event types (15 min, 30 min, 60 min, etc.) with title, description, duration, and buffer time
- **Availability** — Set weekly availability with custom time ranges per day (Mon–Sun)
- **Bookings** — View all upcoming and past bookings, cancel confirmed bookings
- **Copy Booking Link** — One-click copy of the public booking URL for any event type
- **Public Booking Page** — Share `/u/username` with anyone to let them browse and book your events

### For the Guest (Public)
- **Browse Events** — View all active event types on the host's public page
- **Calendar Picker** — Interactive calendar showing only available days
- **Time Slot Picker** — Auto-generated slots based on availability, duration, and buffer time
- **Booking Form** — Enter name, email, and optional notes to confirm a booking
- **Confirmation Page** — Instant booking confirmation with all details

### General
- Fully **responsive** — works on mobile, tablet, and desktop
- Clean, professional UI with smooth animations
- Consistent blue color theme throughout

---

## Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React 18 | UI framework |
| Vite | Build tool & dev server |
| React Router v6 | Client-side routing |
| Tailwind CSS | Utility-first styling |
| Axios | HTTP client |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js | Runtime |
| Express.js | Web framework |
| Prisma ORM | Database access & migrations |
| MySQL | Relational database |
| JWT (jsonwebtoken) | Authentication tokens |
| bcryptjs | Password hashing |

### Deployment
| Service | Purpose |
|---------|---------|
| Vercel | Frontend hosting |
| Render | Backend hosting |
| Railway / PlanetScale | MySQL database hosting |

---

## Project Structure

```
scheduler/
├── client/                  # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── booking/     # BookingCalendar, TimeSlotPicker, BookingForm
│   │   │   ├── dashboard/   # Sidebar, EventTypeForm
│   │   │   └── ui/          # Button, Input, Badge, Spinner
│   │   ├── hooks/
│   │   │   └── useAuth.jsx  # Auth context & hook
│   │   ├── pages/           # All page components
│   │   ├── services/        # Axios API calls
│   │   └── utils/           # Date helpers
│   ├── index.html
│   └── vite.config.js
│
└── server/                  # Node.js backend
    ├── controllers/         # Route handlers
    ├── middleware/          # JWT auth middleware
    ├── prisma/
    │   ├── schema.prisma    # Database schema
    │   └── seed.js          # Sample data
    ├── routes/              # Express routes
    ├── services/            # Slot generation logic
    └── index.js             # Entry point
```

---

## Database Schema

```
User
 ├── EventType (one-to-many)
 │    └── Booking (one-to-many)
 └── AvailabilityDay (one-to-many)
      └── AvailabilityTimeSlot (one-to-many)
```

---

## Local Setup

### Prerequisites
- Node.js v18+
- MySQL running locally (or a cloud MySQL URL)
- Git

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/scheduler.git
cd scheduler
```

### 2. Install dependencies

```bash
npm run install:all
```

### 3. Configure the backend

```bash
cd server
cp .env.example .env
```

Edit `server/.env`:

```env
DATABASE_URL="mysql://root:yourpassword@localhost:3306/scheduler_db"
JWT_SECRET="your-random-secret-key"
PORT=5000
```

### 4. Set up the database

```bash
cd server

# Run migrations
npx prisma migrate dev --name init

# Seed sample data (Indian names, 4 event types, 11 bookings)
node prisma/seed.js
```

### 5. Configure the frontend

```bash
cd client
cp .env.example .env
```

Edit `client/.env`:

```env
VITE_API_URL=http://localhost:5000
```

### 6. Run the project

From the root directory:

```bash
npm run dev
```

This starts both frontend (`http://localhost:5173`) and backend (`http://localhost:5000`) concurrently.

### 7. Login

```
Email:    admin@scheduler.com
Password: admin123
```

---

## API Reference

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and get JWT token |
| GET | `/api/auth/me` | Get current user |

### Event Types
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/events` | List all event types (auth) |
| POST | `/api/events` | Create event type (auth) |
| PUT | `/api/events/:id` | Update event type (auth) |
| DELETE | `/api/events/:id` | Delete event type (auth) |
| GET | `/api/events/public/user/:username` | Public profile events |
| GET | `/api/events/public/:slug` | Single public event |

### Availability
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/availability` | Get availability (auth) |
| POST | `/api/availability` | Save availability (auth) |
| GET | `/api/availability/public/:slug` | Public availability for event |

### Bookings
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/bookings` | List bookings (auth) |
| POST | `/api/bookings` | Create a booking (public) |
| PATCH | `/api/bookings/:id/cancel` | Cancel a booking (auth) |

### Slots
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/slots?eventTypeId=&date=` | Get available time slots |

---

## Deployment

### Backend → Render

1. Create a Web Service on [render.com](https://render.com)
2. Root Directory: `server`
3. Build Command: `npm install && npx prisma generate && npx prisma migrate deploy`
4. Start Command: `npm start`
5. Environment variables:
   ```
   DATABASE_URL=your_mysql_url
   JWT_SECRET=your_secret
   CLIENT_URL=https://your-vercel-app.vercel.app
   NODE_ENV=production
   ```

### Frontend → Vercel

1. Import repo on [vercel.com](https://vercel.com)
2. Root Directory: `client`
3. Framework: Vite
4. Environment variable:
   ```
   VITE_API_URL=https://your-render-app.onrender.com
   ```

---

## Environment Variables

### Server (`server/.env`)

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | MySQL connection string | `mysql://user:pass@host/db` |
| `JWT_SECRET` | Secret key for JWT signing | `my-secret-key` |
| `PORT` | Server port | `5000` |
| `CLIENT_URL` | Frontend URL for CORS | `https://yourapp.vercel.app` |

### Client (`client/.env`)

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend base URL (no `/api`) | `https://yourapi.onrender.com` |

---

## License

MIT — free to use and modify.
