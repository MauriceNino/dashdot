FROM node:18-alpine

WORKDIR /app

RUN \
  apk update &&\
  apk add git make clang build-base lsblk dmidecode util-linux lm-sensors speedtest-cli

COPY . ./

RUN \
  yarn &&\
  yarn build

EXPOSE 3001

CMD ["yarn", "start"]