# --- build stage ---
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Vite bakes VITE_* vars into the bundle at build time, so they must be
# supplied as build args rather than runtime env vars.
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY

RUN npm run build

# --- runtime stage ---
# Not nginx: docker-server.js also re-implements the Vercel serverless
# function at api/analyze.js, so it needs a Node process, not static hosting.
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY api ./api
COPY docker-server.js ./
COPY --from=build /app/dist ./dist

# Set at container runtime, never at build time — it must not reach the
# client bundle (see api/analyze.js and README.md).
ENV GEMINI_API_KEY=""

EXPOSE 80

CMD ["node", "docker-server.js"]
