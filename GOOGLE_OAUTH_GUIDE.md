# Google OAuth Setup - Step by Step

Follow these exact steps:

## Step 1: Create a Google Cloud Project

1. **Go to**: https://console.cloud.google.com/
2. Click the **project dropdown** at the top (next to "Google Cloud")
3. Click **"New Project"**
4. **Project name**: `UsTime`
5. Click **"Create"**
6. Wait for the project to be created (notification will appear)
7. **Select the new project** from the dropdown

---

## Step 2: Enable Google Identity Services

1. In the search bar at the top, type: `Google Identity`
2. Click on **"Google Identity Services API"** or **"Google+ API"**
3. Click **"Enable"**
4. Wait for it to enable

---

## Step 3: Configure OAuth Consent Screen

1. Go to **"APIs & Services" → "OAuth consent screen"** (left sidebar)
2. Choose **"External"** user type
3. Click **"Create"**

**Fill in the form:**
- **App name**: `UsTime`
- **User support email**: Your email
- **Developer contact email**: Your email
- Leave other fields as default

4. Click **"Save and Continue"**
5. On "Scopes" page, click **"Save and Continue"** (no changes needed)
6. On "Test users" page, click **"Save and Continue"** (no changes needed)
7. Click **"Back to Dashboard"**

---

## Step 4: Create OAuth Client ID

1. Go to **"APIs & Services" → "Credentials"** (left sidebar)
2. Click **"+ Create Credentials"** at the top
3. Select **"OAuth client ID"**

**Configure the client:**
- **Application type**: `Web application`
- **Name**: `UsTime Local Dev`

**Authorized JavaScript origins:**
- Click **"+ Add URI"**
- Add: `http://localhost:3000`
- Click **"+ Add URI"** again
- Add: `http://localhost:3001`

**Authorized redirect URIs:**
- Click **"+ Add URI"**
- Add: `http://localhost:3001/api/auth/callback/google`

4. Click **"Create"**

---

## Step 5: Copy Your Credentials

A popup will show your credentials:
- **Client ID**: Starts with something like `123456-abc.apps.googleusercontent.com`
- **Client Secret**: A random string

**Copy both of these!**

---

## Step 6: Update Your .env File

Open `/Users/dmnk/projects/personal/ustime/.env` and update:

```bash
GOOGLE_CLIENT_ID=paste_your_client_id_here
GOOGLE_CLIENT_SECRET=paste_your_client_secret_here
```

Save the file.

---

## Step 7: Restart Backend

In your terminal running `npm run dev:server`:
1. Press `Ctrl+C` to stop
2. Run: `npm run dev:server`

---

## Step 8: Test It!

1. Go to http://localhost:3000
2. Click **"Sign in with Google"**
3. Choose your Google account
4. Authorize the app
5. You should be logged in! ✅

---

## Troubleshooting

**"redirect_uri_mismatch" error:**
- Go back to Google Cloud Console
- Check that the redirect URI is EXACTLY: `http://localhost:3001/api/auth/callback/google`
- Make sure there's no trailing slash

**"Access blocked" error:**
- Your OAuth consent screen is in "Testing" mode
- Add your email as a test user in "OAuth consent screen" → "Test users"

**Still not working:**
- Double-check there are no spaces in your .env credentials
- Make sure you selected the correct project in Google Cloud Console
- Try refreshing http://localhost:3000 after restarting the backend
