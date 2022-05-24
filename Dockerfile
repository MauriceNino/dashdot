FROM node:16-alpine

WORKDIR /app

COPY . ./

RUN apk update && apk add lsblk && apk add dmidecode && apk add util-linux
RUN yarn --immutable --immutable-cache && yarn build

EXPOSE 3001

CMD ["yarn", "start"]