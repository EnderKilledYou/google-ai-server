FROM node:lts-alpine

RUN apk add --update python3 make g++\
   && rm -rf /var/cache/apk/*

WORKDIR /app

ENV NODE_ENV development
COPY package.json yarn.lock ./
RUN yarn

COPY . .

ENV GOOGLE_APPLICATION_CREDENTIALS /app/google-key.json

CMD [ "yarn", "start:dev" ]

