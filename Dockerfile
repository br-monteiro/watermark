FROM node:10.20-alpine3.11

WORKDIR /opt/app

COPY . /opt/app

RUN npm install

CMD "npm start"
