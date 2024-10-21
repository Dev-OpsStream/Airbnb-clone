FROM node:20

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json (if it exists)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application code
COPY . .

# Ensure Node is available
RUN which node

# Expose the port your app listens on (update as necessary)
EXPOSE 4000

# Start the application
CMD ["node", "index.js"]
