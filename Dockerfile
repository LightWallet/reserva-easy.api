FROM alpine:3.4

# File Author / Maintainer
LABEL authors="Andres Sebastian Caceres <chevass@protonmail.com>"

# Update & install required packages
RUN apk add --update nodejs bash git

# Install app dependencies
COPY package.json /www/package.json
RUN cd /www; yarn install

# Copy app source
COPY . /www

# Set work directory to /www
WORKDIR /www

# set your port
ENV PORT 8080

# expose the port to outside world
EXPOSE  8080

# start command as per package.json
CMD ["yarn", "start"]
