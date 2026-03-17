# Stage 1: Install dependencies
FROM node:18-alpine AS deps
WORKDIR /app

# Install frontend dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Install backend dependencies
COPY backend/package.json backend/package-lock.json ./backend/
RUN cd backend && npm ci

# Stage 2: Build frontend
FROM node:18-alpine AS frontend-build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY package.json package-lock.json tsconfig.json vite.config.ts tailwind.config.js postcss.config.js index.html ./
COPY src ./src
COPY public ./public
COPY prisma ./prisma
RUN npx vite build

# Stage 3: Build backend
FROM node:18-alpine AS backend-build
WORKDIR /app/backend
COPY --from=deps /app/backend/node_modules ./node_modules
COPY backend/package.json backend/tsconfig.json ./
COPY backend/src ./src
COPY backend/prisma ./prisma
RUN npx prisma generate
RUN npm run build

# Stage 4: Production image
FROM node:18-alpine AS production
WORKDIR /app

# Install only production dependencies for backend
COPY backend/package.json backend/package-lock.json ./backend/
RUN cd backend && npm ci --omit=dev

# Copy Prisma schema and generate client
COPY backend/prisma ./backend/prisma
RUN cd backend && npx prisma generate

# Copy built frontend (served by backend or nginx)
COPY --from=frontend-build /app/dist ./dist

# Copy built backend
COPY --from=backend-build /app/backend/dist ./backend/dist

# Set environment
ENV NODE_ENV=production
ENV PORT=4041

EXPOSE 4041

CMD ["node", "backend/dist/index.js"]
