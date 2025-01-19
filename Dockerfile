#Use official Node.js image as the base image
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json first for caching dependencies
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the entire project
COPY . .

# Build the Next.js static site
RUN npm run build && npm run export

# Create a lightweight production image with Nginx
FROM nginx:alpine

# Copy built static files from the builder stage
COPY --from=builder /app/out /usr/share/nginx/html

# Expose port 80 for serving the static site
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]

