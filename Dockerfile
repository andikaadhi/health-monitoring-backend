FROM node:14.17.6-alpine3.10 AS build

ENV NODE_ENV=production

WORKDIR /app

COPY ["package.json", "yarn.lock*", "./"]

RUN yarn install --production

COPY . .

EXPOSE 3001

CMD ["node", "server.js"]
