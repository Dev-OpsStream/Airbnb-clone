FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json (if it exists)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application code (including models)
COPY . .

# Verify the file structure and contents of the /app directory to check if 'User.js' is copied
RUN ls -al /app/models

# Install curl (should work on these images)
RUN apk add --no-cache curl libcurl zlib # for Alpine-based images

# Ensure Node is available
RUN which node && curl --version

# Expose the port your app listens on
EXPOSE 4000

# Start the application
CMD ["node", "index.js"]
