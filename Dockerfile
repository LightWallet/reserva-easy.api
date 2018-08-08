FROM node:10.8.0-alpine

EXPOSE 9000

ARG NODE_ENV
ENV NODE_ENV production

RUN mkdir /app
WORKDIR /app
ADD package.json yarn.lock /app/
RUN yarn --pure-lockfile
ADD . /app

CMD ["yarn", "docker:start"]
