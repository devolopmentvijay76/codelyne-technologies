FROM node:20-bookworm-slim AS base

WORKDIR /app

RUN apt-get update \
  && apt-get install -y --no-install-recommends python3 make g++ \
  && rm -rf /var/lib/apt/lists/*

COPY package*.json ./

FROM base AS dev

ENV NODE_ENV=development

RUN npm ci

COPY . .

EXPOSE 5000

CMD ["npm", "run", "dev"]

FROM base AS build

ENV NODE_ENV=production

RUN npm ci

COPY . .

RUN npm run build

FROM node:20-bookworm-slim AS production

WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=build /app/dist ./dist

EXPOSE 5000

CMD ["npm", "run", "start"]
