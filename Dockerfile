# BASE #
FROM node:18-alpine AS base

WORKDIR /app

RUN \
  apk update &&\
  apk add git make clang build-base lsblk dmidecode util-linux lm-sensors speedtest-cli &&\
  git config --global --add safe.directory /app

# DEV #
FROM base AS dev

EXPOSE 3001
EXPOSE 3000

# BUILD #
FROM base as build

COPY . ./

RUN \
  yarn &&\
  yarn build

# PROD #
FROM base as prod

COPY --from=build /app/package.json .
COPY --from=build /app/.yarn/releases/ .yarn/releases/
COPY --from=build /app/node_modules/ node_modules/
COPY --from=build /app/dist/ dist/

EXPOSE 3001

CMD ["yarn", "start"]