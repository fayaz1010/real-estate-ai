FROM node:18-alpine

WORKDIR /app

# Copy root package files
COPY package.json package-lock.json ./

# Install root dependencies
RUN npm ci --ignore-scripts

# Copy backend package files
COPY backend/package.json backend/package-lock.json ./backend/

# Install backend dependencies
RUN cd backend && npm ci --ignore-scripts

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
