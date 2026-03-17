FROM node:18-slim

RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy root package files
COPY package.json package-lock.json ./

# Install root dependencies
RUN npm ci

# Copy backend package files
COPY backend/package.json backend/package-lock.json ./backend/

# Install backend dependencies
RUN cd backend && npm ci

# Copy all source code
COPY . .

# Generate Prisma client
RUN cd backend && npx prisma generate

# Build backend
RUN cd backend && npx tsc

# Build frontend
RUN npx vite build

# Set environment
ENV NODE_ENV=production
ENV PORT=4041

EXPOSE 4041

CMD ["node", "backend/dist/index.js"]
