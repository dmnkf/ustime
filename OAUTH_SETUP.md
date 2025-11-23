# Setting Up OAuth for UsTime

## Google OAuth Setup (Recommended - Start Here)

### Step 1: Go to Google Cloud Console
Visit: https://console.cloud.google.com/

### Step 2: Create a Project
1. Click the project dropdown at the top
2. Click "New Project"
3. Name it "UsTime" 
4. Click "Create"

### Step 3: Enable Google+ API
1. In the search bar, type "Google+ API"
2. Click on it
3. Click "Enable"

### Step 4: Create OAuth Credentials
1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth client ID"
3. If prompted, configure the OAuth consent screen:
   - User Type: **External**
   - App name: **UsTime**
   - User support email: **your email**
   - Developer contact: **your email**
   - Click "Save and Continue" through the rest

4. Back to creating OAuth client ID:
   - Application type: **Web application**
   - Name: **UsTime Local Dev**
   - Authorized JavaScript origins:
     - `http://localhost:3000`
     - `http://localhost:3001`
   - Authorized redirect URIs:
     - `http://localhost:3001/api/auth/callback/google`
   - Click "Create"

### Step 5: Copy Credentials
You'll see a dialog with:
- **Client ID**: Copy this
- **Client Secret**: Copy this

### Step 6: Add to .env
Open your `.env` file and paste:

```bash
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
```

### Step 7: Restart Backend
In the terminal running `npm run dev:server`, press `Ctrl+C` and run:
```bash
npm run dev:server
```

✅ **Google OAuth is done!**

---

## Apple OAuth Setup (Optional - More Complex)

Apple OAuth requires:
- An Apple Developer account ($99/year)
- More setup steps

### Prerequisites
- Apple Developer account
- Access to developer.apple.com

### Step 1: Create an App ID
1. Go to https://developer.apple.com/account/
2. Click "Certificates, Identifiers & Profiles"
3. Click "Identifiers" → "+" button
4. Select "App IDs" → Continue
5. Description: **UsTime**
6. Bundle ID: **com.yourname.ustime** (must be unique)
7. Scroll down and check "Sign in with Apple"
8. Click "Continue" → "Register"

### Step 2: Create a Services ID
1. Back in Identifiers, click "+" again
2. Select "Services IDs" → Continue
3. Description: **UsTime Web**
4. Identifier: **com.yourname.ustime.web**
5. Check "Sign in with Apple"
6. Click "Configure" next to Sign in with Apple
7. Primary App ID: Select the App ID you created
8. Domains and Subdomains: **localhost** (for dev)
9. Return URLs: **http://localhost:3001/api/auth/callback/apple**
10. Click "Continue" → "Register"

### Step 3: Create a Private Key
1. Go to "Keys" → "+" button
2. Key Name: **UsTime Sign in with Apple Key**
3. Check "Sign in with Apple"
4. Click "Configure" → Select your App ID
5. Click "Continue" → "Register"
6. **Download the .p8 file** - you can only download this ONCE!

### Step 4: Get Your Team ID
1. On developer.apple.com, your Team ID is in the top right
2. Copy it

### Step 5: Add to .env
```bash
APPLE_CLIENT_ID=com.yourname.ustime.web
APPLE_TEAM_ID=YOUR_TEAM_ID
APPLE_KEY_ID=YOUR_KEY_ID_FROM_DOWNLOAD_PAGE
APPLE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----
(paste contents of .p8 file here)
-----END PRIVATE KEY-----
```

### Step 6: Restart Backend
```bash
# Stop backend (Ctrl+C)
npm run dev:server
```

✅ **Apple OAuth is done!**

---

## Testing OAuth

1. Go to http://localhost:3000
2. Click "Sign in with Google" (or Apple)
3. Authorize the app
4. You should be signed in!

---

## Quick Start (Google Only)

**Just want to test quickly?** 

1. Set up only Google OAuth (5 minutes)
2. Leave Apple credentials empty in `.env`
3. The Apple button will be disabled automatically

---

## Troubleshooting

### "redirect_uri_mismatch" error
- Make sure the redirect URI in Google Cloud Console matches EXACTLY:
  - `http://localhost:3001/api/auth/callback/google`
  
### "Invalid client" error
- Double-check your Client ID and Secret in `.env`
- Make sure there are no extra spaces

### Apple OAuth not working
- Verify all URLs use **https** in production (http://localhost is OK for dev)
- Check that the Services ID is properly configured
