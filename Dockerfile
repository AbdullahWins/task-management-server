# Base image
FROM node:22.12.0-bullseye

# Set working directory
WORKDIR /usr/src/app

# Install build tools for bcrypt
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

# Copy package.json and yarn.lock
COPY package.json yarn.lock ./

# Install dependencies (skip dev dependencies for production)
RUN yarn install --production

# Copy the application source code
COPY . .

# Build the TypeScript code (if applicable)
RUN yarn build

# Expose the app's port (change if your app uses a different port)
EXPOSE 5000

# Start the application
CMD ["yarn", "start"]
