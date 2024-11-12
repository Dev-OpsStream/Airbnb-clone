# Use the Node.js image (you can use a slim version if space is a concern)
FROM node:18

# Set working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Clean any existing node_modules and package-lock.json files before installation
RUN rm -rf node_modules package-lock.json

# Install dependencies with legacy-peer-deps to handle peer dependency issues
RUN npm install --legacy-peer-deps

# Copy the rest of the application code to the container
COPY . .

# Set environment variable to bind to all network interfaces
ENV HOST=0.0.0.0

# Build the Vite app for production
RUN npm run build

# Add a step to list the contents of the dist directory for debugging
RUN ls -la /app/dist

# Expose the production port (use port 80 in production)
EXPOSE 80

# Install a lightweight HTTP server globally (e.g., 'serve')
RUN npm install -g serve

# Run the application in production mode using 'serve'
CMD ["serve", "-s", "dist", "-l", "80", "--single"]

