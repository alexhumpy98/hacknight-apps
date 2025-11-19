# Deployment Guide - Google AI Studio

This guide explains how to deploy the Google Drive Chat Assistant to Google AI Studio.

## Prerequisites

- Your app is already linked to a GitHub repository
- You have access to Google AI Studio
- You have your OAuth Client ID configured

## Automatic Deployment

Based on your setup, the app auto-deploys from GitHub:

1. **Push code to GitHub** (already done)
   ```bash
   git push
   ```

2. **Google AI Studio auto-deploys** - The app at https://ai.studio/apps/drive/1AtPJG6-wEE--B6wSkUXGYO6V-qFTXtoe should update automatically

3. **Wait a few minutes** for the deployment to complete

## Environment Variables in Google AI Studio

### Important: Setting Environment Variables

Google AI Studio needs access to your environment variables. However, the process differs from local development:

**Current Challenge:**
- The `.env.local` file is ignored by git (for security)
- Google AI Studio needs `GOOGLE_CLIENT_ID` and `GEMINI_API_KEY`
- These variables must be configured in AI Studio's environment

**Possible Solutions:**

### Option 1: Google AI Studio Secrets (Recommended)
If Google AI Studio supports secrets/environment variables:
1. Go to your app settings in AI Studio
2. Add environment variables:
   - `GOOGLE_CLIENT_ID`: `612789484517-7clcavrokbflemdjfnp7o4455od94mac.apps.googleusercontent.com`
   - `GEMINI_API_KEY`: Your Gemini API key

### Option 2: Vite Build-Time Variables
If AI Studio doesn't support runtime environment variables, you may need to:
1. Configure the build process to inject variables at build time
2. Use AI Studio's build configuration settings

### Option 3: Hardcode for Production (Not Recommended)
As a temporary workaround:
- Create a separate config file for production
- **Never commit API keys to the repository!**

## OAuth Configuration for Production

Your OAuth Client ID must include the AI Studio domain:

1. Go to [Google Cloud Console Credentials](https://console.cloud.google.com/apis/credentials)
2. Click on your OAuth 2.0 Client ID
3. Under **"Authorized JavaScript origins"**, ensure you have:
   - ✅ `https://aistudio.google.com` (for AI Studio deployment)
   - ✅ `http://localhost:3000` (for local development)
   - ✅ `http://127.0.0.1:3000` (alternative localhost)
4. Click **"Save"**
5. Wait 5-10 minutes for changes to propagate

## Testing the Deployed App

1. Open your app in Google AI Studio:
   https://ai.studio/apps/drive/1AtPJG6-wEE--B6wSkUXGYO6V-qFTXtoe

2. Check the browser console (F12) for any errors

3. Try clicking **"Connect to Google Drive"**

4. Expected behavior:
   - ✅ Google OAuth popup appears
   - ✅ You can sign in and grant permissions
   - ✅ App connects successfully

## Troubleshooting Deployment

### App doesn't update after git push

- Check if auto-deploy is enabled in AI Studio
- Verify the GitHub repository is correctly linked
- Try manually triggering a deployment in AI Studio

### "GOOGLE_CLIENT_ID is not set" in deployed app

- The environment variables aren't configured in AI Studio
- Check AI Studio's settings for environment variable configuration
- May need to contact Google AI Studio support for environment variable setup

### OAuth error in deployed app

- Verify `https://aistudio.google.com` is in Authorized JavaScript origins
- Check that the correct Client ID is being used
- Wait for OAuth changes to propagate (5-10 minutes)

### Console errors about missing API key

- GEMINI_API_KEY not configured in AI Studio environment
- Check AI Studio's documentation for setting secrets/environment variables

## Important Notes

⚠️ **Security:**
- Never commit `.env.local` to git (it's in `.gitignore`)
- Never hardcode API keys or secrets in the source code
- Use AI Studio's secret management for production

✅ **Best Practice:**
- Keep sensitive credentials in environment variables
- Use separate OAuth credentials for development vs production if needed
- Document the deployment process for your team

## Next Steps

Once deployment is working:
1. Test authentication with colleagues
2. Verify Google Drive search works
3. Monitor for any production errors
4. Begin implementing RAG features (see ROADMAP.md)

## Need Help?

If you encounter issues with Google AI Studio deployment:
- Check AI Studio documentation for environment variable configuration
- Contact Google AI Studio support
- Review the browser console for specific error messages
