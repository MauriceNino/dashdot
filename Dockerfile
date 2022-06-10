# BASE #
FROM node:18-alpine AS base

WORKDIR /app

RUN \
  apk update &&\
  apk --no-cache add \
    lsblk \
    dmidecode \
    util-linux \
    lm-sensors \
    speedtest-cli &&\
  apk --no-cache add \
    raspberrypi \
    || true

# DEV #
FROM base AS dev

EXPOSE 3001
EXPOSE 3000

# BUILD #
FROM base as build

RUN \
  apk --no-cache add \
    git \
    make \
    clang \
    build-base &&\
  git config --global --add safe.directory /app

COPY . ./

RUN \
  yarn &&\
  yarn build

# PROD #
FROM base as prod

COPY --from=build /app/package.json .
COPY --from=build /app/.yarn/releases/ .yarn/releases/
COPY --from=build /app/dist/ dist/

EXPOSE 3001

CMD ["yarn", "start"]