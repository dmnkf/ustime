# UsTime - Couple Activity Picker

A self-hosted Progressive Web App for couples to discover and share activity ideas.

## Stack

- **Frontend**: React + Vite + TailwindCSS
- **Backend**: Hono (Node.js)
- **Database**: PostgreSQL + Drizzle ORM
- **Auth**: Better Auth (Google & Apple SSO)
- **Realtime**: WebSockets
- **PWA**: Vite PWA Plugin

## Prerequisites

- Node.js 18+ 
- PostgreSQL database (local or hosted)
- Google OAuth credentials (for SSO)
- Apple OAuth credentials (for SSO)

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Then fill in your values:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/ustime

# Auth (Better Auth)
BETTER_AUTH_SECRET=your_random_secret_here_minimum_32_chars
BETTER_AUTH_URL=http://localhost:3001

# OAuth Providers
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
APPLE_CLIENT_ID=your_apple_client_id
APPLE_CLIENT_SECRET=your_apple_client_secret
```

### 3. Setup Database

#### Option A: Push Schema Directly (Development)

```bash
npm run db:push
```

This will push the schema directly to your database without generating migration files.

#### Option B: Generate and Run Migrations (Recommended for Production)

```bash
# Generate migration files
npm run db:generate

# Run migrations
npm run db:migrate
```

### 4. Run the Application

You need to run **both** the frontend and backend:

**Terminal 1 - Frontend:**
```bash
npm run dev
```

**Terminal 2 - Backend:**
```bash
npm run dev:server
```

The frontend will be available at `http://localhost:3000`  
The backend API will be available at `http://localhost:3001`

## Database Management

### View Database with Drizzle Studio

```bash
npm run db:studio
```

This opens a web UI at `https://local.drizzle.studio` to browse your database.

### Generate New Migrations

After modifying `server/db/schema.ts`:

```bash
npm run db:generate
npm run db:migrate
```

## OAuth Setup

### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3001/api/auth/callback/google`
6. Copy Client ID and Secret to `.env`

### Apple OAuth

1. Go to [Apple Developer](https://developer.apple.com/)
2. Create an App ID
3. Enable "Sign in with Apple"
4. Create a Service ID
5. Configure return URLs: `http://localhost:3001/api/auth/callback/apple`
6. Generate a private key
7. Add credentials to `.env`

## Deployment (Railway)

1. Create a new project on [Railway](https://railway.app)
2. Add a PostgreSQL database
3. Deploy this repository
4. Set environment variables in Railway dashboard
5. Update `BETTER_AUTH_URL` to your production URL

## Troubleshooting

### Database Connection Issues

- Verify `DATABASE_URL` is correct
- Ensure PostgreSQL is running
- Check database user has necessary permissions

### Auth Not Working

- Verify OAuth credentials are correct
- Check redirect URIs match your configuration
- Ensure `BETTER_AUTH_SECRET` is at least 32 characters

### WebSocket Connection Fails

- Ensure backend server is running on port 3001
- Check firewall settings
- Verify CORS configuration in `server/index.ts`

## License

MIT
