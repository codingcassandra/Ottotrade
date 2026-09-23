FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY src ./src
COPY scripts ./scripts
RUN mkdir -p cache

ENV PORT=4000
EXPOSE 4000

CMD ["node", "src/server.js"]
