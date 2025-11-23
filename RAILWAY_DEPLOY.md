# Railway Deployment Guide

This guide will help you deploy UsTime to Railway with PostgreSQL database.

## Prerequisites

- Railway account (sign up at [railway.app](https://railway.app))
- GitHub repository with your code
- Google OAuth credentials (already configured)

## Deployment Steps

### 1. Prepare Your Code

First, let's create production-ready configurations:

#### Update `lib/api.ts` for Production

Replace hardcoded URLs with environment variables:

```typescript
const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:3001';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
```

#### Update `lib/auth-client.ts` for Production

```typescript
export const authClient = createAuthClient({
    baseURL: import.meta.env.VITE_AUTH_URL || "http://localhost:3001"
})
```

#### Create `railway.json` (optional, for backend config)

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm run start:prod",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

#### Add Production Start Script to `package.json`

```json
{
  "scripts": {
    "start:prod": "node --loader tsx server/index.ts"
  }
}
```

### 2. Deploy Backend to Railway

#### Option A: Deploy via Railway CLI

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Link to your project
railway link

# Deploy
railway up
```

#### Option B: Deploy via Railway Dashboard

1. Go to [railway.app/new](https://railway.app/new)
2. Click **"Deploy from GitHub repo"**
3. Select your `ustime` repository
4. Railway will auto-detect it as a Node.js app

### 3. Add PostgreSQL Database

1. In your Railway project dashboard, click **"+ New"**
2. Select **"Database" → "Add PostgreSQL"**
3. Railway will automatically create a database and set `DATABASE_URL`

### 4. Configure Environment Variables

In Railway dashboard, go to your backend service → **Variables** tab:

```bash
# Auth
BETTER_AUTH_SECRET=<generate-new-random-secret>
BETTER_AUTH_URL=https://your-backend.railway.app

# OAuth (from Google Cloud Console)
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>

# Database (automatically set by Railway)
DATABASE_URL=<automatically-provided>
```

**Generate a new secret:**
```bash
openssl rand -base64 32
```

### 5. Update Google OAuth Redirect URLs

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Click on your OAuth 2.0 Client ID
3. Add to **Authorized redirect URIs**:
   ```
   https://your-backend.railway.app/api/auth/callback/google
   ```
4. Add to **Authorized JavaScript origins**:
   ```
   https://your-frontend.vercel.app
   ```

### 6. Run Database Migrations

After deployment, run migrations via Railway CLI:

```bash
railway run npm run db:push
```

Or use Railway's **"Run Command"** feature in the dashboard.

### 7. Deploy Frontend to Railway (Railway Only)

Since you want to avoid Vercel, we can deploy the frontend on Railway too!

#### Option A: Serve Static Frontend from Backend (Easiest)

1. Build the frontend:
   ```bash
   npm run build
   ```
2. Update `server/index.ts` to serve static files from `dist/`:
   ```typescript
   import { serveStatic } from '@hono/node-server/serve-static'
   
   // ... after API routes ...
   
   app.use('/*', serveStatic({ root: './dist' }))
   app.get('*', serveStatic({ path: './dist/index.html' }))
   ```
3. Deploy the single repo. Railway will build both and the backend will serve the frontend.

#### Option B: Separate Frontend Service on Railway

1. In your Railway project, click **"+ New" → "GitHub Repo"**
2. Select the same `ustime` repo again.
3. Configure this new service as the **Frontend**:
   - **Build Command:** `npm run build`
   - **Start Command:** `npm run preview -- --port $PORT --host` (or use a static server like `serve`)
   - **Variables:**
     ```bash
     VITE_API_URL=https://your-backend-service.railway.app/api
     VITE_WS_URL=wss://your-backend-service.railway.app
     VITE_AUTH_URL=https://your-backend-service.railway.app
     ```

### 8. Test Production Deployment

1. Open your Railway service URL.
2. Click "Sign in with Google".
3. Verify OAuth flow works.
4. Test partner connection.
5. Test real-time pitching.

## Troubleshooting

### WebSocket Connection Issues

If WebSockets don't work, Railway might need explicit configuration. Update `server/index.ts`:

```typescript
const port = parseInt(process.env.PORT || '3001');
```

### CORS Issues

Update `server/index.ts`:

```typescript
app.use('*', cors({
    origin: [
        'http://localhost:3000',
        process.env.FRONTEND_URL || '',
        'https://your-frontend.vercel.app'
    ],
    credentials: true,
}));
```

### Database Connection Issues

Ensure `DATABASE_URL` is set correctly. Railway provides this automatically.

## Alternative: Deploy Both on Railway

You can deploy both frontend and backend on Railway:

1. Create two services in the same project
2. Service 1: Backend (Node.js)
3. Service 2: Frontend (Static site)
4. Configure environment variables accordingly

## Cost Estimate

- **Railway:** $5/month for Hobby plan (includes PostgreSQL)
- **Vercel:** Free for personal projects
- **Google Cloud:** Free (OAuth only)

**Total:** ~$5/month

## Post-Deployment Checklist

- [ ] Backend deployed and accessible
- [ ] Database migrated
- [ ] Frontend deployed
- [ ] Google OAuth redirect URLs updated
- [ ] Environment variables set
- [ ] Sign-in flow tested
- [ ] Partner connection tested
- [ ] Real-time pitching tested
- [ ] PWA installable on mobile

## Monitoring

Railway provides built-in monitoring:
- View logs in real-time
- Check resource usage
- Set up alerts

## Scaling

Railway auto-scales based on usage. For high traffic:
- Upgrade to Pro plan ($20/month)
- Consider Redis for WebSocket session management
- Use Railway's metrics to optimize

---

Need help? Check [Railway docs](https://docs.railway.app) or ask in their Discord!
