# Production Dockerfile for RoomIA API Microservice
FROM node:20-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install --production

COPY src ./src

ENV NODE_ENV=production
ENV PORT=4000

EXPOSE 4000

CMD ["node", "src/index.js"]
