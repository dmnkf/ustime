# UsTime Architecture Guide

## System Overview

```mermaid
graph TB
    subgraph "Frontend (localhost:3000)"
        UI[React App]
        Auth[AuthContext]
        WS[WebSocket Client]
        SW[Service Worker]
    end
    
    subgraph "Backend (localhost:3001)"
        API[Hono Server]
        BAuth[Better Auth]
        WSS[WebSocket Server]
    end
    
    subgraph "External"
        Google[Google OAuth]
    end
    
    subgraph "Database (localhost:5433)"
        DB[(PostgreSQL)]
    end
    
    UI --> Auth
    UI --> WS
    Auth --> BAuth
    WS --> WSS
    BAuth --> Google
    API --> DB
    WSS --> DB
    BAuth --> DB
```

## Authentication Flow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant B as Backend
    participant G as Google
    participant D as Database

    U->>F: Click "Sign in with Google"
    F->>B: POST /api/auth/sign-in/social
    B->>G: Redirect to OAuth
    G->>U: Show consent screen
    U->>G: Approve
    G->>B: Callback with code
    B->>G: Exchange for tokens
    G->>B: User info
    B->>D: Create user + session
    B->>F: Redirect to localhost:3000
    F->>B: GET /api/auth/get-session
    B->>F: Session data
    F->>U: Show main app
```

## Partner Connection Flow

```mermaid
sequenceDiagram
    participant U1 as User 1
    participant F1 as Frontend 1
    participant B as Backend
    participant D as Database
    participant F2 as Frontend 2
    participant U2 as User 2

    U1->>F1: Open Connect Modal
    F1->>U1: Show code (ABC123)
    U2->>F2: Enter "ABC123"
    F2->>B: POST /api/connect
    B->>D: Find user with code
    B->>D: Link both users
    B->>F2: Return partnerId
    F2->>F2: Save to localStorage
    F2->>U2: "Connected!"
```

## Real-time Pitch Flow

```mermaid
sequenceDiagram
    participant U1 as User 1
    participant F1 as Frontend 1
    participant WS as WebSocket Server
    participant D as Database
    participant F2 as Frontend 2
    participant U2 as User 2

    Note over F1,F2: Both connect on login
    F1->>WS: {type: 'auth', userId: '1'}
    F2->>WS: {type: 'auth', userId: '2'}
    WS->>WS: Store connections
    
    U1->>F1: Pick activity, click "Pitch"
    F1->>WS: {type: 'pitch', receiverId: '2', activity}
    WS->>D: Save pitch
    WS->>F2: Forward pitch message
    F2->>U2: Show toast notification
```

## Database Schema

```mermaid
erDiagram
    USER ||--o{ SESSION : has
    USER ||--o{ PITCH : sends
    USER ||--o{ PITCH : receives
    USER ||--o| USER : partners_with
    USER ||--o{ ACCOUNT : has

    USER {
        string id PK
        string name
        string email
        string partnerCode UK
        string partnerId FK
    }
    
    SESSION {
        string id PK
        string userId FK
        string token UK
        timestamp expiresAt
    }
    
    ACCOUNT {
        string id PK
        string userId FK
        string providerId
        string accessToken
    }
    
    PITCH {
        uuid id PK
        string senderId FK
        string receiverId FK
        string activityTitle
        string activityCategory
        string status
        timestamp createdAt
    }
```

## Key Technologies

### Frontend
- **React** - UI framework
- **Vite** - Build tool + dev server
- **Better Auth React** - Auth hooks
- **Framer Motion** - Animations
- **WebSocket API** - Real-time communication
- **PWA** - Service worker via vite-plugin-pwa

### Backend
- **Hono** - Web framework
- **Better Auth** - OAuth + session management
- **Drizzle ORM** - Database queries
- **ws** - WebSocket server
- **PostgreSQL** - Database

### Infrastructure
- **Docker** - PostgreSQL container
- **Google Cloud** - OAuth provider

## File Structure

```
ustime/
├── components/           # React UI components
│   ├── ConnectDeviceModal.tsx
│   ├── PitchActivityModal.tsx
│   └── Toast.tsx
├── contexts/            # React contexts
│   └── AuthContext.tsx  # Auth state management
├── lib/                 # Utilities
│   ├── api.ts          # WebSocket client
│   └── auth-client.ts  # Better Auth client
├── server/             # Backend
│   ├── index.ts        # Hono server + WebSocket
│   ├── auth.ts         # Better Auth config
│   └── db/             # Database
│       ├── schema.ts   # Drizzle schema
│       └── index.ts    # DB connection
├── public/             # Static assets
│   ├── pwa-192x192.png
│   └── pwa-512x512.png
├── App.tsx             # Main app component
├── index.tsx           # Entry point + SW registration
└── vite.config.ts      # Vite + PWA config
```

## Data Flow

### 1. User Signs In
```
User → Frontend → Backend → Google → Backend → Database → Frontend
```

### 2. Users Connect
```
User A → Frontend A → Backend → Database
                                    ↓
User B ← Frontend B ← Backend ← Database
```

### 3. User Pitches Activity
```
User A → Frontend A → WebSocket → Backend → Database
                                      ↓
                                  WebSocket → Frontend B → User B
```

## Environment Variables

```bash
# Database
DATABASE_URL=postgresql://ustime:password@localhost:5433/ustime

# Auth
BETTER_AUTH_SECRET=<random-secret>
BETTER_AUTH_URL=http://localhost:3001

# OAuth
GOOGLE_CLIENT_ID=<from-google-cloud>
GOOGLE_CLIENT_SECRET=<from-google-cloud>
```

## Running the App

```bash
# Terminal 1: Frontend
npm run dev

# Terminal 2: Backend
npm run dev:server

# Terminal 3: Database (if not using Docker)
docker-compose up
```

## Production Deployment Checklist

- [ ] Set production environment variables
- [ ] Update OAuth redirect URLs in Google Cloud Console
- [ ] Deploy database (Railway, Supabase, etc.)
- [ ] Deploy backend (Railway, Fly.io, etc.)
- [ ] Deploy frontend (Vercel, Netlify, etc.)
- [ ] Update `BETTER_AUTH_URL` to production backend URL
- [ ] Update WebSocket URL in `lib/api.ts`
- [ ] Test OAuth flow in production
- [ ] Test partner connection
- [ ] Test real-time pitching
