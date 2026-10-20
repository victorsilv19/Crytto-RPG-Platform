FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev --no-audit --no-fund

COPY --chown=node:node src/ ./src/

EXPOSE 3001

ENV NODE_ENV=production
USER node

CMD ["node", "src/index.js"]
