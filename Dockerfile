FROM node:16-alpine

WORKDIR /app

COPY . ./

RUN \
  apk update &&\
  apk add lsblk dmidecode util-linux lm-sensors

RUN \
  yarn --immutable --immutable-cache &&\
  yarn build

EXPOSE 3001

CMD ["yarn", "start"]