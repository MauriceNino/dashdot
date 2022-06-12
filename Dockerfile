# BASE #
FROM node:18-alpine AS base

WORKDIR /app

ARG TARGETPLATFORM

RUN \
  apk update &&\
  apk --no-cache add \
    lsblk \
    dmidecode \
    util-linux \
    lm-sensors \
    speedtest-cli &&\
  if [ "$TARGETPLATFORM" = "linux/amd64" ] || [ "$(uname -m)" = "x86_64" ]; \
    then \
      wget -qO- https://install.speedtest.net/app/cli/ookla-speedtest-1.1.1-linux-x86_64.tgz \
        | tar xmoz -C /usr/bin speedtest &&\
      speedtest --accept-license --accept-gdpr > /dev/null; \
  elif [ "$TARGETPLATFORM" = "linux/arm64" ] || [ "$(uname -m)" = "aarch64" ]; \
    then \
      wget -qO- https://install.speedtest.net/app/cli/ookla-speedtest-1.1.1-linux-aarch64.tgz \
        | tar xmoz -C /usr/bin speedtest &&\
      speedtest --accept-license --accept-gdpr > /dev/null &&\
      apk --no-cache add raspberrypi; \
  elif [ "$TARGETPLATFORM" = "linux/arm/v7" ]; \
    then \
      wget -qO- https://install.speedtest.net/app/cli/ookla-speedtest-1.1.1-linux-armhf.tgz \
        | tar xmoz -C /usr/bin speedtest &&\
      speedtest --accept-license --accept-gdpr > /dev/null &&\
      apk --no-cache add raspberrypi; \
  else echo "Unsupported platform"; exit 1; \
  fi

# DEV #
FROM base AS dev

RUN \
  apk --no-cache add \
    git &&\
  git config --global --add safe.directory /app

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