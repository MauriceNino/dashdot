FROM node:16-alpine

WORKDIR /app

COPY . ./

RUN \
  echo "**** update packages ****" && \
    apk --quiet --no-cache --no-progress update && \
  echo "**** install build packages ****" && \
    apk add -U --update --no-cache --quiet lsblk dmidecode util-linux && \
  echo "**** run yarn build  ****" && \
    yarn --frozen-lockfile && \
    yarn build

EXPOSE 3001

CMD ["yarn", "start"]
