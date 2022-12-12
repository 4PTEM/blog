FROM node:16.10.0-alpine as builder

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm i

COPY prisma ./prisma

RUN npx prisma generate

COPY . .

RUN npm run compile

FROM node:16.10.0-alpine as blog

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm i

COPY .env ./.env

COPY prisma ./prisma

RUN npx prisma generate

COPY public ./public

COPY --from=builder /usr/src/app/out ./out

CMD ["npm", "run", "migrate:start"]