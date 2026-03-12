FROM node:24-alpine AS build
ENV YARN_VERSION=4.12.0
WORKDIR /app

COPY . .
RUN corepack enable && corepack prepare yarn@${YARN_VERSION}
RUN yarn install --frozen-lockfile
RUN echo EXPO_PUBLIC_API_URL="https://api.hurribrain.net">>./apps/app/.env.production
RUN yarn workspace app run web:build

FROM node:24-alpine AS run
ENV NODE_ENV=production
WORKDIR /app
COPY --link --from=build /app/apps/app/dist ./dist
EXPOSE 8081

CMD [ "npx", "serve", "-s", "dist", "-l", "8081" ]