# Multi-stage build for Google Cloud Run deployment
# Stage 1: Build the application
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build arguments for environment variables
ARG GEMINI_API_KEY
ARG GOOGLE_CLIENT_ID

# Set environment variables for build
ENV GEMINI_API_KEY=${GEMINI_API_KEY}
ENV GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID}

# Build the application
RUN npm run build

# Stage 2: Production server
FROM node:20-alpine AS runner

WORKDIR /app

# Install serve to run the static files
RUN npm install -g serve

# Copy built files from builder stage
COPY --from=builder /app/dist ./dist

# Expose port (Cloud Run will set PORT environment variable)
ENV PORT=8080
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:${PORT}', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Run the application using serve
CMD ["sh", "-c", "serve -s dist -l ${PORT}"]
