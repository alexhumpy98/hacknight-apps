<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Google Drive Chat Assistant

An AI-powered chat interface that searches your Google Drive documents and provides answers using Google's Gemini AI.

## Deployment Options

- 🚀 **Google Cloud Run**: Production-ready deployment with auto-scaling ([Guide](docs/CLOUD_RUN_DEPLOYMENT.md))
- 🔬 **Google AI Studio**: Quick testing and prototyping ([View](https://ai.studio/apps/drive/1AtPJG6-wEE--B6wSkUXGYO6V-qFTXtoe))
- 💻 **Local Development**: Run on your machine for development

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

## Deploy to Production

### Google Cloud Run (Recommended)

Deploy to Google Cloud Run for a production-ready, scalable deployment:

```bash
./deploy-cloud-run.sh
```

📖 **[Cloud Run Deployment Guide](docs/CLOUD_RUN_DEPLOYMENT.md)**

Benefits:
- ✅ Auto-scaling from 0 to handle traffic spikes
- ✅ Pay only for what you use
- ✅ Automatic HTTPS and SSL certificates
- ✅ Secure environment variable management
- ✅ Custom domain support

### Google AI Studio

For quick testing and sharing with colleagues:

📖 **[AI Studio Deployment Guide](docs/DEPLOYMENT.md)**

## Documentation

- **[Setup Guide](docs/SETUP.md)** - First-time setup and OAuth configuration
- **[Cloud Run Deployment](docs/CLOUD_RUN_DEPLOYMENT.md)** - Production deployment guide
- **[AI Studio Deployment](docs/DEPLOYMENT.md)** - AI Studio deployment
- **[Roadmap](ROADMAP.md)** - Planned RAG features and improvements
