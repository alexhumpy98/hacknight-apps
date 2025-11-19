#!/bin/bash

# Google Cloud Run Deployment Script for Google Drive Chat Assistant
# This script builds and deploys the application to Google Cloud Run

set -e  # Exit on any error

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}Google Drive Chat Assistant - Cloud Run Deployment${NC}"
echo "================================================================"

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo -e "${RED}Error: .env.local file not found${NC}"
    echo "Please create .env.local with your GEMINI_API_KEY and GOOGLE_CLIENT_ID"
    exit 1
fi

# Load environment variables from .env.local
export $(cat .env.local | grep -v '^#' | xargs)

# Check required environment variables
if [ -z "$GEMINI_API_KEY" ]; then
    echo -e "${RED}Error: GEMINI_API_KEY not set in .env.local${NC}"
    exit 1
fi

if [ -z "$GOOGLE_CLIENT_ID" ]; then
    echo -e "${RED}Error: GOOGLE_CLIENT_ID not set in .env.local${NC}"
    exit 1
fi

# Configuration
PROJECT_ID="${GOOGLE_CLOUD_PROJECT:-}"
SERVICE_NAME="drive-chat-assistant"
REGION="${GOOGLE_CLOUD_REGION:-us-central1}"
IMAGE_NAME="gcr.io/${PROJECT_ID}/${SERVICE_NAME}"

# Prompt for project ID if not set
if [ -z "$PROJECT_ID" ]; then
    echo -e "${YELLOW}Enter your Google Cloud Project ID:${NC}"
    read PROJECT_ID
    if [ -z "$PROJECT_ID" ]; then
        echo -e "${RED}Error: Project ID is required${NC}"
        exit 1
    fi
fi

echo ""
echo "Deployment Configuration:"
echo "  Project ID: $PROJECT_ID"
echo "  Service Name: $SERVICE_NAME"
echo "  Region: $REGION"
echo "  Image: $IMAGE_NAME"
echo ""

# Confirm deployment
echo -e "${YELLOW}Continue with deployment? (y/n)${NC}"
read -r CONFIRM
if [ "$CONFIRM" != "y" ]; then
    echo "Deployment cancelled"
    exit 0
fi

echo ""
echo -e "${GREEN}Step 1: Configuring gcloud${NC}"
gcloud config set project $PROJECT_ID

echo ""
echo -e "${GREEN}Step 2: Enabling required APIs${NC}"
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com

echo ""
echo -e "${GREEN}Step 3: Building Docker image${NC}"
docker build \
    --build-arg GEMINI_API_KEY="$GEMINI_API_KEY" \
    --build-arg GOOGLE_CLIENT_ID="$GOOGLE_CLIENT_ID" \
    -t $IMAGE_NAME \
    .

echo ""
echo -e "${GREEN}Step 4: Pushing image to Google Container Registry${NC}"
docker push $IMAGE_NAME

echo ""
echo -e "${GREEN}Step 5: Deploying to Cloud Run${NC}"
gcloud run deploy $SERVICE_NAME \
    --image $IMAGE_NAME \
    --platform managed \
    --region $REGION \
    --allow-unauthenticated \
    --set-env-vars "GEMINI_API_KEY=$GEMINI_API_KEY,GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID" \
    --port 8080 \
    --memory 512Mi \
    --cpu 1 \
    --min-instances 0 \
    --max-instances 10

echo ""
echo -e "${GREEN}Step 6: Getting service URL${NC}"
SERVICE_URL=$(gcloud run services describe $SERVICE_NAME --platform managed --region $REGION --format 'value(status.url)')

echo ""
echo "================================================================"
echo -e "${GREEN}Deployment Successful!${NC}"
echo ""
echo "Service URL: $SERVICE_URL"
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo "1. Update OAuth Authorized JavaScript Origins:"
echo "   - Go to: https://console.cloud.google.com/apis/credentials"
echo "   - Add: $SERVICE_URL"
echo ""
echo "2. Test your app at: $SERVICE_URL"
echo ""
echo "================================================================"
