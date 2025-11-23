# Backend Setup Complete ✅

I've set up a **fully self-hosted backend** for UsTime with comprehensive database management.

## What's Been Built

### Database Infrastructure
- **Drizzle ORM** with PostgreSQL
- **Auto-generated migrations** (`drizzle/` folder)
- **Migration runner** (`server/db/migrate.ts`)
- **Database utilities** with error handling
- **Partner code generation** (unique 6-char codes)

### Authentication
- **Better Auth** with Google & Apple SSO
- **Auto-generates partner codes** when users sign up
- **Hooks system** to ensure code uniqueness

### API Endpoints
- `POST /api/auth/**` - Better Auth handlers
- `POST /api/connect` - Link users by partner code
- WebSocket server for real-time pitching

### Database Schema
```
user
├─ id (auth managed)
├─ email
├─ name
├─ partnerCode (auto-generated)
└─ partnerId (linked partner)

pitch
├─ id
├─ senderId
├─ receiverId
├─ activityTitle
├─ activityCategory
└─ status (pending/accepted/rejected)
```

## Setup Instructions

### 1. Install PostgreSQL

**macOS (Homebrew):**
```bash
brew install postgresql@15
brew services start postgresql@15
createdb ustime
```

**Docker:**
```bash
docker run --name ustime-postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=ustime -p 5432:5432 -d postgres:15
```

### 2. Configure Environment

Create `.env`:
```bash
DATABASE_URL=postgresql://postgres:password@localhost:5432/ustime

BETTER_AUTH_SECRET=$(openssl rand -base64 32)
BETTER_AUTH_URL=http://localhost:3001

# Optional for now - can set up later
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
APPLE_CLIENT_ID=
APPLE_CLIENT_SECRET=
```

### 3. Setup Database

**Option A: Quick Push (Dev)**
```bash
npm run db:push
```

**Option B: Migrations (Prod)**
```bash
npm run db:generate  # Already done
npm run db:migrate   # Run migrations
```

### 4. Start Everything

**Terminal 1 - Backend:**
```bash
npm run dev:server
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

### 5. Test It Out

1. Visit `http://localhost:3000`
2. Sign in (will create a user)
3. Get your partner code from Connect modal
4. Open incognito, sign in as second user
5. Enter first user's code to connect
6. Try pitching activities!

## Database Management Commands

```bash
npm run db:studio      # Open Drizzle Studio UI
npm run db:generate    # Generate new migrations
npm run db:migrate     # Run migrations
npm run db:push        # Push schema directly (dev)
```

## Deployment to Railway

1. Create new project on [railway.app](https://railway.app)
2. Add PostgreSQL database
3. Deploy from GitHub
4. Set environment variables
5. Run migrations: `npm run db:migrate`

## Next Steps

- Configure OAuth (see README.md)
- Test multi-device connectivity
- Deploy to production
- Add activity sharing features
