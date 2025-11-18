<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1AtPJG6-wEE--B6wSkUXGYO6V-qFTXtoe

## Run Locally

**Prerequisites:**  Node.js (version 16+)

### Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   ```bash
   cp .env.local.example .env.local
   ```
   Then edit `.env.local` and add:
   - Your Gemini API key (get it from https://aistudio.google.com/app/apikey)
   - Your Google OAuth Client ID (see setup guide below)

3. **Run the app:**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:3000`

### First Time Setup

If this is your first time running the app, follow the comprehensive setup guide:

📖 **[Complete Setup Guide](docs/SETUP.md)**

This guide includes:
- How to get your Gemini API key
- How to create Google OAuth credentials
- Detailed troubleshooting steps
- Testing your connection
