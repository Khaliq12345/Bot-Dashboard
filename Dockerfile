# Use a Node.js base image for SSR
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy the pre-built Nuxt app files (from .output for Nuxt 3 SSR)
COPY .output ./.output

RUN ls /app

# Expose port 3000 (default for Nuxt SSR)
EXPOSE 3000

# Start the Nuxt server
CMD ["node", ".output/server/index.mjs"]
