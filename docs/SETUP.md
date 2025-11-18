# Google Drive Chat Assistant - Setup Guide

This guide will walk you through setting up the Google Drive Chat Assistant for local development.

## Prerequisites

- **Node.js** (version 16 or higher)
- **npm** (comes with Node.js)
- **Google Cloud Account** (free tier is sufficient)
- **Gemini API Key**

## Step 1: Install Dependencies

Clone the repository and install dependencies:

```bash
npm install
```

## Step 2: Create Environment Configuration

1. Copy the example environment file:
   ```bash
   cp .env.local.example .env.local
   ```

2. Open `.env.local` in your text editor

## Step 3: Get Your Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click **"Create API Key"** or **"Get API Key"**
4. Copy the generated API key
5. Paste it in your `.env.local` file:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   ```

## Step 4: Set Up Google Drive API Access

### Create a Google Cloud Project (if you don't have one)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click **"Select a project"** → **"New Project"**
3. Enter a project name (e.g., "Drive Chat Assistant")
4. Click **"Create"**

### Enable the Google Drive API

1. In the Google Cloud Console, go to **APIs & Services** → **Library**
2. Search for **"Google Drive API"**
3. Click on it and press **"Enable"**

### Create OAuth 2.0 Credentials

1. Go to **APIs & Services** → **Credentials**
2. Click **"Create Credentials"** → **"OAuth client ID"**
3. If prompted, configure the OAuth consent screen:
   - Choose **"External"** (unless you have a Google Workspace)
   - Fill in the app name: "Google Drive Chat Assistant"
   - Add your email as the developer contact
   - Click **"Save and Continue"**
   - For **Scopes**, click **"Add or Remove Scopes"** and add:
     - `.../auth/drive.readonly` (View your Google Drive files)
   - Click **"Save and Continue"**
   - Add yourself as a test user (your Google email)
   - Click **"Save and Continue"**

4. Back in **Credentials**, create the OAuth client ID:
   - Application type: **"Web application"**
   - Name: "Google Drive Chat Assistant"
   - **Authorized JavaScript origins**: Add these URLs (click "+ Add URI" for each):
     - `http://localhost:3000` (for local development)
     - `http://127.0.0.1:3000` (alternative localhost)
     - `https://aistudio.google.com` (if deploying to Google AI Studio)
   - **Authorized redirect URIs**: Leave empty (not needed for JavaScript OAuth flow)
   - Click **"Create"**

   ⚠️ **IMPORTANT**: The Authorized JavaScript origins must **exactly match** where your app runs:
   - Use `http://` (not `https://`) for localhost
   - Include the port number (`:3000`)
   - No trailing slashes
   - Changes can take 5-10 minutes to propagate

5. Copy the **Client ID** (it looks like `xxxxx-xxxxx.apps.googleusercontent.com`)

6. Paste it in your `.env.local` file:
   ```
   GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
   ```

## Step 5: Verify Your Configuration

Your `.env.local` file should look like this:

```
GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
GOOGLE_CLIENT_ID=123456789-xxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com
```

⚠️ **Important**: Never commit this file to Git! It's already in `.gitignore`.

## Step 6: Run the Application

Start the development server:

```bash
npm run dev
```

The application will open at: `http://localhost:3000`

## Step 7: Test Google Drive Connection

1. Click the **"Connect to Google Drive"** button
2. You'll see a Google sign-in popup
3. Choose your Google account
4. You may see a warning that the app is unverified (this is normal for apps in development)
   - Click **"Advanced"**
   - Click **"Go to Google Drive Chat Assistant (unsafe)"**
5. Grant permission to view your Google Drive files
6. You should now be connected!

## Troubleshooting

### "GOOGLE_CLIENT_ID is not set" error

- Make sure you created `.env.local` (not `.env.local.example`)
- Check that your Client ID is correctly pasted
- Restart the dev server (`npm run dev`)

### "API key not valid" error

- Verify your Gemini API key is correct
- Check that you copied the entire key without extra spaces
- Make sure the API key has no usage restrictions

### OAuth popup is blocked

- Allow popups for `localhost:3000` in your browser
- Try using an incognito/private window

### "Error 400: redirect_uri_mismatch"

This is the most common error! It means your OAuth credentials don't allow your app's origin.

**Solution:**
1. Go to [Google Cloud Console Credentials](https://console.cloud.google.com/apis/credentials)
2. Click on your OAuth 2.0 Client ID
3. Under **"Authorized JavaScript origins"**, verify these are added:
   - `http://localhost:3000` (exact match, with port)
   - `http://127.0.0.1:3000`
4. Click **"Save"**
5. **Wait 5-10 minutes** for changes to propagate
6. Clear your browser cache or use incognito mode
7. Try connecting again

**Common mistakes:**
- ❌ Using `https://localhost:3000` (should be `http://`)
- ❌ Missing the port `:3000`
- ❌ Adding trailing slashes `http://localhost:3000/`
- ❌ Not waiting for changes to propagate

### "Access blocked: This app's request is invalid"

- Check that your OAuth consent screen is configured
- Verify that `http://localhost:3000` is added to Authorized JavaScript origins
- Make sure you added yourself as a test user

### "The API returned an error: invalid_client"

- Double-check your Client ID is correct
- Verify the Client ID matches a Web application type (not Desktop or other)
- Ensure the authorized origins include `http://localhost:3000`

## Next Steps

Once connected, you can:
- Ask questions about your Google Drive documents
- The app will search your Drive and use AI to answer based on the content
- View source documents that were used to generate the answer

## Additional Resources

- [Google Drive API Documentation](https://developers.google.com/drive/api)
- [Google OAuth 2.0 Guide](https://developers.google.com/identity/protocols/oauth2)
- [Gemini API Documentation](https://ai.google.dev/docs)
