# Stage 2: Build Express Server
FROM node:latest
WORKDIR /server

# copy files from server
COPY . .

# install deps
RUN npm install

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.2.1/wait /wait
RUN chmod +x /wait


# start server
# reset the database on fresh build
CMD /wait && npm run make-tables && npm run start

