# Use a lightweight Node.js image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Clean previous installations if they exist
RUN rm -rf node_modules package-lock.json

# Install dependencies with legacy-peer-deps to handle peer dependency issues
RUN npm install --legacy-peer-deps

# Copy the rest of the application code
COPY . .

# Set environment variable to bind to all network interfaces
ENV HOST=0.0.0.0

# Build the Vite app for production
RUN npm run build

# Expose the production port (use port 80 in production)
EXPOSE 80

# Serve the application with a lightweight HTTP server (e.g., serve)
RUN npm install -g serve

# Run the application in production mode using the "serve" command
CMD ["serve", "-s", "dist", "-l", "80", "--single"]

