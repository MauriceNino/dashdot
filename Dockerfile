FROM node:16-alpine

WORKDIR /app

COPY . ./

RUN yarn --frozen-lockfile && yarn build

EXPOSE 3001

CMD ["yarn", "start"]