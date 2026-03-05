# Build
FROM node:24-alpine AS build
WORKDIR /app

COPY yarn.lock /app/yarn.lock
COPY apps/api/package.json /app/package.json
COPY ./apps/api /app/
RUN corepack enable
RUN yarn

ENV NODE_ENV=production 
ENV HOST=0.0.0.0 
ENV PORT=8080
ENV REDIS_HOST=hurribrain-redis
ENV POSTGRES_HOST=hurribrain-postgres
EXPOSE 8080
CMD [ "node", "dist/index.js" ]