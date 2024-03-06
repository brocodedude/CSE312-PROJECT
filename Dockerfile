# Stage 2: Build Express Server
FROM node:latest
WORKDIR /server

# copy files from server
COPY . .

# install deps
RUN npm install

# start server
CMD npm run start

