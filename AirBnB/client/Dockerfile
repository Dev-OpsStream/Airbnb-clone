FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Set environment variable to bind to all network interfaces
ENV HOST=0.0.0.0

# Expose the port that Vite uses
EXPOSE 5173

# Start the Vite development server
CMD ["npm", "run", "dev"]
