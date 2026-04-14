FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/
COPY prisma.config.ts ./

RUN npm install

COPY . .

RUN npx prisma generate

RUN npm run build

EXPOSE 8000

CMD npx prisma migrate deploy && node dist/index.js
