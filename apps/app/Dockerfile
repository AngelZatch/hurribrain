FROM node:24-alpine AS build
ARG REACT_APP_BACKEND_URL="hurribrain-api"
WORKDIR /app

COPY yarn.lock /app/yarn.lock
COPY apps/app/package.json /app/package.json
COPY apps/app /app/
RUN corepack enable
RUN yarn

ENV NODE_ENV=production
EXPOSE 8081
RUN yarn run web:build
ENTRYPOINT [ "npx", "expo" ]
CMD [ "serve" ]