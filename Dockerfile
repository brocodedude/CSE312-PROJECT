# Stage 2: Build Express Server
FROM node:latest
WORKDIR /server

COPY package.json ./
COPY package-lock.json ./

RUN npm install

COPY api ./

RUN npm install

EXPOSE 9000

CMD npm start
