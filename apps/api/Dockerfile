# Build
FROM node:24-alpine AS build
ENV YARN_VERSION=4.12.0
WORKDIR /app

COPY . .
RUN corepack enable && corepack prepare yarn@${YARN_VERSION}
RUN yarn install --frozen-lockfile

ENV NODE_ENV=production
RUN yarn workspace api run build

FROM node:24-alpine AS run
WORKDIR /app
COPY --link --from=build /app/apps/api/node_modules ./node_modules
COPY --link --from=build /app/apps/api/dist ./dist
EXPOSE ${PORT}
CMD [ "node", "dist/index.js" ]