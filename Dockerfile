FROM ubuntu:latest

RUN apt-get upgrade && apt-get update && apt-get install -y curl && curl -sL https://deb.nodesource.com/setup_13.x | bash && apt-get install -y nodejs

WORKDIR /usr/src/nsa
COPY package*.json ./

COPY . .