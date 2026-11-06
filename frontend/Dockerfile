# Stage 1: Build the application
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files and install dependencies cleanly
COPY package.json package-lock.json ./
RUN npm ci

# Copy the rest of the application source code
COPY . .

# Build the project (Nitro will generate the .output folder)
RUN npm run build

# Stage 2: Production runtime
FROM node:22-alpine AS runner

WORKDIR /app

# Set environment variables for production
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

# Copy ONLY the built output from the builder stage
COPY --from=builder /app/.output ./.output

EXPOSE 3000

# Run the Nitro production server
CMD ["node", ".output/server/index.mjs"]
