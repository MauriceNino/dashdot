# BASE #
FROM node:18-alpine AS base

WORKDIR /app
ARG TARGETPLATFORM
ENV DASHDOT_RUNNING_IN_DOCKER=true

RUN \
  /bin/echo ">> installing dependencies" &&\
  apk update &&\
  apk --no-cache add \
    lsblk \
    mdadm \
    dmidecode \
    util-linux \
    lm-sensors \
    speedtest-cli &&\
  if [ "$TARGETPLATFORM" = "linux/amd64" ] || [ "$(uname -m)" = "x86_64" ]; \
    then \
      /bin/echo ">> installing dependencies (amd64)" &&\
      wget -qO- https://install.speedtest.net/app/cli/ookla-speedtest-1.1.1-linux-x86_64.tgz \
        | tar xmoz -C /usr/bin speedtest; \
  elif [ "$TARGETPLATFORM" = "linux/arm64" ] || [ "$(uname -m)" = "aarch64" ]; \
    then \
      /bin/echo ">> installing dependencies (arm64)" &&\
      wget -qO- https://install.speedtest.net/app/cli/ookla-speedtest-1.1.1-linux-aarch64.tgz \
        | tar xmoz -C /usr/bin speedtest &&\
      apk --no-cache add raspberrypi; \
  elif [ "$TARGETPLATFORM" = "linux/arm/v7" ]; \
    then \
      /bin/echo ">> installing dependencies (arm/v7)" &&\
      wget -qO- https://install.speedtest.net/app/cli/ookla-speedtest-1.1.1-linux-armhf.tgz \
        | tar xmoz -C /usr/bin speedtest &&\
      apk --no-cache add raspberrypi; \
  else /bin/echo "Unsupported platform"; exit 1; \
  fi

# DEV #
FROM base AS dev

EXPOSE 3001
EXPOSE 3000

RUN \
  /bin/echo -e ">> installing dependencies (dev)" &&\
  apk --no-cache add \
    git &&\
  git config --global --add safe.directory /app

# BUILD #
FROM base as build

ARG BUILDHASH
ARG VERSION

ENV NX_DAEMON=false

RUN \
  /bin/echo -e ">> installing dependencies (build)" &&\
  apk --no-cache add \
    git \
    make \
    clang \
    build-base &&\
  git config --global --add safe.directory /app &&\
  /bin/echo -e "{\"version\":\"$VERSION\",\"buildhash\":\"$BUILDHASH\"}" > /app/version.json

COPY . ./

RUN \
  yarn --immutable --immutable-cache &&\
  yarn build:prod

# PROD #
FROM base as prod

EXPOSE 3001

COPY --from=build /app/package.json .
COPY --from=build /app/version.json .
COPY --from=build /app/.yarn/releases/ .yarn/releases/
COPY --from=build /app/dist/apps/server dist/apps/server
COPY --from=build /app/dist/apps/cli dist/apps/cli
COPY --from=build /app/dist/apps/view dist/apps/view

CMD ["yarn", "start"]