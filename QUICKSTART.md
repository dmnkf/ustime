# 🚀 QUICKSTART - Get UsTime Running in 5 Minutes

This guide assumes you have **absolutely nothing** installed except your Mac.

## Prerequisites Check

Do you have these installed?

- [ ] **Node.js 18+**: Run `node -v` in terminal
- [ ] **Docker Desktop**: Run `docker -v` in terminal

### Install Missing Prerequisites

**If you don't have Node.js:**
```bash
# Install using Homebrew (recommended)
brew install node

# OR download from https://nodejs.org
```

**If you don't have Docker Desktop:**
```bash
# Install using Homebrew
brew install --cask docker

# OR download from https://www.docker.com/products/docker-desktop
```

After installing Docker Desktop, **launch the application** before continuing.

---

## Step-by-Step Setup

### 1. Install Dependencies

```bash
npm install
```

**What this does:** Downloads all required packages (React, Hono, Drizzle, Better Auth, etc.)

---

### 2. Start the Database

```bash
docker-compose up -d
```

**What this does:** 
- Downloads PostgreSQL container
- Starts database on port 5432
- The `-d` flag runs it in the background

**Verify it's running:**
```bash
docker ps
# You should see "ustime-postgres" in the list
```

---

### 3. Setup Database Schema

```bash
npm run db:push
```

**What this does:** Creates all the tables (users, sessions, pitches, etc.) in your database

---

### 4. Start the Backend Server

**Open a new terminal window** and run:

```bash
npm run dev:server
```

**What this does:** Starts the Hono backend on `http://localhost:3001`

**You should see:**
```
✅ Database connected successfully
Server is running on port 3001
```

**Keep this terminal open!**

---

### 5. Start the Frontend

**Open ANOTHER new terminal window** and run:

```bash
npm run dev
```

**What this does:** Starts the React frontend on `http://localhost:3000`

**You should see:**
```
VITE ready in XXX ms
➜  Local:   http://localhost:3000/
```

**Keep this terminal open too!**

---

## 🎉 You're Done!

Open your browser to `http://localhost:3000`

You should see the UsTime app!

---

## What You Should Have Running

- ✅ **3 Terminal Windows**
  1. Terminal 1: `docker-compose up -d` (can close after running)
  2. Terminal 2: `npm run dev:server` (keep open)
  3. Terminal 3: `npm run dev` (keep open)

- ✅ **2 Browser Tabs** (for testing)
  1. Tab 1: `http://localhost:3000` (normal)
  2. Tab 2: `http://localhost:3000` (incognito - for testing partner features)

---

## Testing It Out

### Test Authentication
1. Click "Sign in with Google" or "Sign in with Apple"
2. Since you haven't set up OAuth, you'll see an error
3. **This is normal!** We're using email/password as fallback

### Test Partner Connection
1. In Tab 1: Sign in as User A
2. In Tab 2 (incognito): Sign in as User B
3. In Tab 1: Click the Connect icon, copy your code
4. In Tab 2: Enter User A's code → Connect
5. Now you're connected!

### Test Activity Pitching
1. Create some activities in both tabs
2. Pick an activity and click "Pitch to Partner"
3. The other tab should receive a notification!

---

## Stopping Everything

When you're done:

```bash
# Stop the frontend (Terminal 3)
Ctrl + C

# Stop the backend (Terminal 2)  
Ctrl + C

# Stop the database
docker-compose down
```

---

## Troubleshooting

### Database won't start
```bash
# Check if something is using port 5432
lsof -i :5432

# If yes, stop that process or change the port in docker-compose.yml
```

### Backend won't start
```bash
# Check if something is using port 3001
lsof -i :3001

# Make sure .env file exists with correct DATABASE_URL
```

### Frontend won't start  
```bash
# Check if something is using port 3000
lsof -i :3000

# Try deleting node_modules and reinstalling
rm -rf node_modules package-lock.json
npm install
```

### "Database connected" but app crashes
```bash
# Reset the database
docker-compose down -v
docker-compose up -d
npm run db:push
```

---

## Next Steps

- [ ] Set up Google OAuth (see README.md)
- [ ] Set up Apple OAuth (see README.md)  
- [ ] Deploy to Railway (see BACKEND_SETUP.md)
- [ ] Install as PWA on your phone

---

## Daily Development

When you want to work on the app again:

```bash
# Terminal 1
docker-compose up -d

# Terminal 2 
npm run dev:server

# Terminal 3
npm run dev
```

That's it! Now you're developing.
