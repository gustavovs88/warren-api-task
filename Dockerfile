FROM node:16

WORKDIR /node-app

COPY package.json .

COPY migrate-mongo-config.js .

COPY migrations /migrations

RUN npm install --quiet

RUN npm install nodemon -g --quiet

RUN npm install migrate-mongo -g --quiet

COPY . . 

USER node

EXPOSE 9000

