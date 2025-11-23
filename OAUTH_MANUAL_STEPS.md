# Quick OAuth Setup - Follow These Clicks

You're already on the Credentials page. Here's exactly what to click:

## Step 1: Create OAuth Consent Screen (If Needed)

**If you see "CONFIGURE CONSENT SCREEN":**

1. Click **"CONFIGURE CONSENT SCREEN"**
2. Select **"External"** → Click **"CREATE"**
3. Fill in:
   - App name: `UsTime`
   - User support email: **(select your email from dropdown)**
   - Developer contact email: **(type your email)**
4. Click **"SAVE AND CONTINUE"** (bottom right)
5. Click **"SAVE AND CONTINUE"** again (Scopes page - don't add anything)
6. Click **"SAVE AND CONTINUE"** again (Test users - don't add anyone)
7. Click **"BACK TO DASHBOARD"**

---

## Step 2: Create OAuth Client ID

1. Click **"+ CREATE CREDENTIALS"** (top of page)
2. Select **"OAuth client ID"**
3. Application type: Select **"Web application"** from dropdown
4. Name: Type `UsTime Local Dev`

5. **Under "Authorized JavaScript origins":**
   - Click **"+ ADD URI"**
   - Type: `http://localhost:3000`
   - Click **"+ ADD URI"** again
   - Type: `http://localhost:3001`

6. **Under "Authorized redirect URIs":**
   - Click **"+ ADD URI"**
   - Type: `http://localhost:3001/api/auth/callback/google`

7. Click **"CREATE"** (bottom right)

---

## Step 3: Copy Your Credentials

A popup will appear with:
- **Your Client ID** (long string ending in `.apps.googleusercontent.com`)
- **Your Client Secret** (shorter random string)

**COPY BOTH AND PASTE THEM BELOW:**

```
Client ID: 
Client Secret: 
```

Once you paste them, I'll update your `.env` file automatically!

---

## Current Page
You should be here: APIs & Services → Credentials
URL: https://console.cloud.google.com/apis/credentials?project=ustime-479021
