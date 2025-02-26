FROM oven/bun:latest AS base

LABEL fly_launch_runtime="Bun"

# Bun app lives here
WORKDIR /app

# Set production environment
ENV NODE_ENV="production"

# Throw-away build stage to reduce size of final image
FROM base AS build

# Copy package.json for installation
COPY package.json ./

# Install dependencies
RUN bun install

# Copy application code
COPY . .

# Build application
RUN bun run build

# Final stage for app image
FROM base

# Copy built application
COPY --from=build /app /app

# Expose the port
EXPOSE 3000

# Start the server
CMD [ "bun", "run", "start" ]