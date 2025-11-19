# Google Cloud Run Deployment Guide

This guide explains how to deploy the Google Drive Chat Assistant to Google Cloud Run.

## Why Cloud Run?

- ✅ **Fully managed**: No server management required
- ✅ **Auto-scaling**: Scales from 0 to handle traffic spikes
- ✅ **Pay-per-use**: Only pay when requests are being processed
- ✅ **Environment variables**: Secure secret management
- ✅ **Custom domains**: Use your own domain name
- ✅ **HTTPS**: Automatic SSL certificates

## Prerequisites

Before deploying, ensure you have:

1. **Google Cloud Account** with billing enabled
2. **Google Cloud CLI (gcloud)** installed
   - Install: https://cloud.google.com/sdk/docs/install
   - Verify: `gcloud --version`
3. **Docker** installed and running
   - Install: https://docs.docker.com/get-docker/
   - Verify: `docker --version`
4. **Google Cloud Project** created
   - Create at: https://console.cloud.google.com/projectcreate
5. **OAuth Credentials** set up (see docs/SETUP.md)
6. **Environment variables** configured in `.env.local`

## Quick Deployment

### Option 1: Using the Deployment Script (Recommended)

The easiest way to deploy is using the provided script:

```bash
./deploy-cloud-run.sh
```

The script will:
1. Check for required environment variables
2. Build the Docker image
3. Push to Google Container Registry
4. Deploy to Cloud Run
5. Display your service URL

### Option 2: Manual Deployment

If you prefer manual control:

#### Step 1: Set up gcloud

```bash
# Login to Google Cloud
gcloud auth login

# Set your project ID
gcloud config set project YOUR_PROJECT_ID

# Enable required APIs
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com
```

#### Step 2: Build the Docker image

```bash
# Load environment variables
export $(cat .env.local | grep -v '^#' | xargs)

# Set project ID
export PROJECT_ID=YOUR_PROJECT_ID

# Build the image
docker build \
  --build-arg GEMINI_API_KEY="$GEMINI_API_KEY" \
  --build-arg GOOGLE_CLIENT_ID="$GOOGLE_CLIENT_ID" \
  -t gcr.io/$PROJECT_ID/drive-chat-assistant \
  .
```

#### Step 3: Push to Google Container Registry

```bash
# Configure Docker to use gcloud credentials
gcloud auth configure-docker

# Push the image
docker push gcr.io/$PROJECT_ID/drive-chat-assistant
```

#### Step 4: Deploy to Cloud Run

```bash
gcloud run deploy drive-chat-assistant \
  --image gcr.io/$PROJECT_ID/drive-chat-assistant \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars "GEMINI_API_KEY=$GEMINI_API_KEY,GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID" \
  --port 8080 \
  --memory 512Mi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 10
```

#### Step 5: Get your service URL

```bash
gcloud run services describe drive-chat-assistant \
  --platform managed \
  --region us-central1 \
  --format 'value(status.url)'
```

## Post-Deployment Configuration

### 1. Update OAuth Authorized JavaScript Origins

**Critical Step**: Your OAuth credentials must include the Cloud Run URL.

1. Get your Cloud Run service URL (from deployment output)
   - It will look like: `https://drive-chat-assistant-xxxxx-uc.a.run.app`

2. Go to [Google Cloud Console Credentials](https://console.cloud.google.com/apis/credentials)

3. Click on your OAuth 2.0 Client ID

4. Under **"Authorized JavaScript origins"**, add:
   - Your Cloud Run URL (e.g., `https://drive-chat-assistant-xxxxx-uc.a.run.app`)
   - Keep existing origins:
     - `http://localhost:3000` (for local dev)
     - `https://aistudio.google.com` (if using AI Studio)

5. Click **"Save"**

6. **Wait 5-10 minutes** for changes to propagate

### 2. Test Your Deployment

1. Open your Cloud Run URL in a browser
2. Click **"Connect to Google Drive"**
3. Sign in with your Google account
4. Grant Drive permissions
5. Test a query to verify it works

## Environment Variables

The application requires these environment variables:

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Your Gemini API key from AI Studio | Yes |
| `GOOGLE_CLIENT_ID` | OAuth 2.0 Client ID from Google Cloud | Yes |

These are set during deployment and stored securely in Cloud Run.

## Deployment Configuration Options

### Memory and CPU

Default: 512Mi memory, 1 CPU

For higher traffic:
```bash
--memory 1Gi --cpu 2
```

### Scaling

Control min/max instances:
```bash
--min-instances 0 --max-instances 10
```

- `min-instances 0`: Scales to zero when no traffic (saves cost)
- `max-instances 10`: Limits maximum concurrent instances

### Region Selection

Choose a region close to your users:
- `us-central1` (Iowa, USA)
- `us-east1` (South Carolina, USA)
- `europe-west1` (Belgium)
- `asia-northeast1` (Tokyo)

Full list: https://cloud.google.com/run/docs/locations

### Custom Domain

To use your own domain:

```bash
gcloud run domain-mappings create \
  --service drive-chat-assistant \
  --domain your-domain.com \
  --region us-central1
```

Then update DNS records as instructed.

## Updating Your Deployment

To deploy updates:

```bash
# Option 1: Use the script
./deploy-cloud-run.sh

# Option 2: Manual update
docker build -t gcr.io/$PROJECT_ID/drive-chat-assistant .
docker push gcr.io/$PROJECT_ID/drive-chat-assistant
gcloud run deploy drive-chat-assistant \
  --image gcr.io/$PROJECT_ID/drive-chat-assistant \
  --region us-central1
```

Cloud Run will perform a rolling update with zero downtime.

## Monitoring and Logs

### View Logs

```bash
# Stream real-time logs
gcloud run services logs tail drive-chat-assistant \
  --region us-central1

# View logs in Cloud Console
https://console.cloud.google.com/run
```

### Monitor Performance

1. Go to [Cloud Run Console](https://console.cloud.google.com/run)
2. Click on your service
3. View metrics:
   - Request count
   - Request latency
   - Container instance count
   - Memory utilization

## Cost Estimation

Cloud Run pricing (as of 2024):

**Free Tier (per month):**
- 2 million requests
- 360,000 GB-seconds of memory
- 180,000 vCPU-seconds

**After free tier:**
- $0.40 per million requests
- $0.00002400 per GB-second
- $0.00001000 per vCPU-second

**Example cost** (10,000 requests/month with 512Mi, 1 CPU):
- ~$0.20/month (well within free tier)

Use the [pricing calculator](https://cloud.google.com/products/calculator) for accurate estimates.

## Troubleshooting

### Deployment fails with "permission denied"

```bash
# Re-authenticate
gcloud auth login

# Set project
gcloud config set project YOUR_PROJECT_ID
```

### "API not enabled" error

```bash
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
```

### OAuth error: "redirect_uri_mismatch"

- Verify Cloud Run URL is in Authorized JavaScript origins
- Wait 5-10 minutes after updating OAuth credentials
- Check for typos in the URL

### Container fails to start

Check logs:
```bash
gcloud run services logs tail drive-chat-assistant --region us-central1
```

Common issues:
- Environment variables not set correctly
- Port not exposed (should be 8080)
- Build failed (check Docker build logs)

### "Service Unavailable" or 503 errors

- Check memory limits (may need to increase from 512Mi)
- Review logs for out-of-memory errors
- Increase timeout if needed:
  ```bash
  --timeout 300
  ```

## Security Best Practices

1. ✅ **Never commit secrets**: Use environment variables
2. ✅ **Restrict OAuth**: Only add necessary JavaScript origins
3. ✅ **Enable Cloud Armor**: For DDoS protection (optional)
4. ✅ **Use Secret Manager**: For production secrets (advanced)
5. ✅ **Monitor logs**: Watch for unusual activity

## Continuous Deployment (Optional)

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Cloud Run

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - uses: google-github-actions/auth@v1
        with:
          credentials_json: ${{ secrets.GCP_CREDENTIALS }}

      - uses: google-github-actions/deploy-cloudrun@v1
        with:
          service: drive-chat-assistant
          image: gcr.io/${{ secrets.GCP_PROJECT_ID }}/drive-chat-assistant
          region: us-central1
          env_vars: |
            GEMINI_API_KEY=${{ secrets.GEMINI_API_KEY }}
            GOOGLE_CLIENT_ID=${{ secrets.GOOGLE_CLIENT_ID }}
```

Add secrets in GitHub repo settings.

## Rollback

If something goes wrong:

```bash
# List revisions
gcloud run revisions list --service drive-chat-assistant --region us-central1

# Rollback to previous revision
gcloud run services update-traffic drive-chat-assistant \
  --to-revisions REVISION_NAME=100 \
  --region us-central1
```

## Cleanup

To delete the service and save costs:

```bash
gcloud run services delete drive-chat-assistant --region us-central1
```

To delete the container image:

```bash
gcloud container images delete gcr.io/$PROJECT_ID/drive-chat-assistant
```

## Next Steps

Once deployed:
1. ✅ Share the URL with your team
2. ✅ Set up custom domain (optional)
3. ✅ Configure monitoring alerts
4. ✅ Implement RAG features (see ROADMAP.md)
5. ✅ Set up CI/CD for automatic deployments

## Support

- [Cloud Run Documentation](https://cloud.google.com/run/docs)
- [Cloud Run Pricing](https://cloud.google.com/run/pricing)
- [Troubleshooting Guide](https://cloud.google.com/run/docs/troubleshooting)
